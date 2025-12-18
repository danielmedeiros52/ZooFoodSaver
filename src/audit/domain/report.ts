import { AuditReport, AuditSummary, ReconciledItem } from '../../@types/audit';

export function buildAuditSummary(items: ReconciledItem[]): AuditSummary {
  let discrepancyCount = 0;
  let unknownCount = 0;

  for (const item of items) {
    if (item.status === 'DISCREPANCY') {
      discrepancyCount += 1;
    }
    if (item.status === 'UNKNOWN') {
      unknownCount += 1;
    }
  }

  return {
    total: items.length,
    discrepancyCount,
    unknownCount,
  };
}

export function buildAuditReport(items: ReconciledItem[]): AuditReport {
  const summary = buildAuditSummary(items);
  return { items, summary };
}
