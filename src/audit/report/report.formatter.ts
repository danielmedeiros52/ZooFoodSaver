import { Injectable } from '@nestjs/common';
import { AuditReport, ReconciledItem } from '../../@types/audit';

@Injectable()
export class ReportFormatter {
  format(report: AuditReport): string {
    const lines: string[] = [];

    lines.push(this.formatHeader(report.executedAt));
    lines.push('');

    for (const item of report.items) {
      lines.push(this.formatItem(item));
    }

    lines.push('');
    lines.push(this.formatSummary(report));
    return lines.join('\n');
  }

  private formatItem(item: ReconciledItem): string {
    const sections: string[] = [];
    sections.push(`Item: ${item.item}`);
    if (item.delivered !== undefined) {
      sections.push(`  Delivered: ${item.delivered}`);
      sections.push(`  Used: ${item.used}`);
      sections.push(`  Expected end: ${item.expectedEnd}`);
    } else {
      sections.push(`  Delivered: missing`);
      sections.push(`  Used: ${item.used}`);
      sections.push(`  Expected end: missing`);
    }

    if (item.actualEnd !== undefined) {
      sections.push(`  Actual end: ${item.actualEnd}`);
    } else {
      sections.push('  Actual end: missing');
    }

    if (item.delta !== undefined) {
      const deltaSign = item.delta > 0 ? '+' : '';
      sections.push(`  Delta: ${deltaSign}${item.delta}`);
    }

    sections.push(`  Status: ${this.formatStatus(item.status)}`);
    return sections.join('\n');
  }

  private formatHeader(executedAt: string): string {
    const headerLines: string[] = [];
    headerLines.push(this.bold(this.colorBlue('=== AUDIT REPORT ===')));
    headerLines.push(`Executed at: ${this.colorCyan(this.formatTimestamp(executedAt))}`);

    return headerLines.join('\n');
  }

  private formatSummary(report: AuditReport): string {
    const coloredDiscrepancy = this.colorRed(report.summary.discrepancyCount);
    const coloredUnknown = this.colorYellow(report.summary.unknownCount);
    const coloredTotal = this.bold(report.summary.total.toString());

    const lines: string[] = [];
    lines.push(this.bold(this.colorBlue('--- SUMMARY ---')));
    lines.push(`Total items: ${coloredTotal}`);
    lines.push(`DISCREPANCIES: ${coloredDiscrepancy}`);
    lines.push(`UNKNOWN: ${coloredUnknown}`);

    return lines.join('\n');
  }

  private formatStatus(status: ReconciledItem['status']): string {
    switch (status) {
      case 'OK':
        return this.colorGreen(status);
      case 'UNKNOWN':
        return this.colorYellow(status);
      case 'DISCREPANCY':
        return this.colorRed(status);
      default:
        return status;
    }
  }

  private colorGreen(value: string | number): string {
    return `\u001B[32m${value}\u001B[0m`;
  }

  private colorYellow(value: string | number): string {
    return `\u001B[33m${value}\u001B[0m`;
  }

  private colorRed(value: string | number): string {
    return `\u001B[31m${value}\u001B[0m`;
  }

  private colorBlue(value: string | number): string {
    return `\u001B[34m${value}\u001B[0m`;
  }

  private colorCyan(value: string | number): string {
    return `\u001B[36m${value}\u001B[0m`;
  }

  private bold(value: string | number): string {
    return `\u001B[1m${value}\u001B[0m`;
  }

  private formatTimestamp(value: string): string {
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date.toISOString();
  }
}