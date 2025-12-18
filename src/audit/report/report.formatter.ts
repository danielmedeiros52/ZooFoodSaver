import { Injectable } from '@nestjs/common';
import { AuditReport, ReconciledItem } from '../../@types/audit';

@Injectable()
export class ReportFormatter {
  format(report: AuditReport): string {
    const lines: string[] = [];
    for (const item of report.items) {
      lines.push(this.formatItem(item));
    }

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

    sections.push(`  Status: ${item.status}`);
    return sections.join('\n');
  }

  private formatSummary(report: AuditReport): string {
    return `Summary: total=${report.summary.total}, DISCREPANCY=${report.summary.discrepancyCount}, UNKNOWN=${report.summary.unknownCount}`;
  }
}