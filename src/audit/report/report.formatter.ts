import { Injectable } from '@nestjs/common';
import { ReconciledItem } from '../domain/types';

@Injectable()
export class ReportFormatter {
  format(items: ReconciledItem[]): string {
    const lines: string[] = [];
    for (const item of items) {
      lines.push(this.formatItem(item));
    }

    lines.push(this.formatSummary(items));
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

  private formatSummary(items: ReconciledItem[]): string {
    const discrepancy = items.filter((item) => item.status === 'DISCREPANCY').length;
    const unknown = items.filter((item) => item.status === 'UNKNOWN').length;
    return `Summary: DISCREPANCY=${discrepancy}, UNKNOWN=${unknown}`;
  }
}