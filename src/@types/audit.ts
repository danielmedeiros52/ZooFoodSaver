export type DeliveryMap = Record<string, number | undefined>;
export type UsageMap = Record<string, number>;
export type InventoryMap = Record<string, number>;

export type Status = 'OK' | 'DISCREPANCY' | 'UNKNOWN';

export interface AuditSummary {
  readonly total: number;
  readonly discrepancyCount: number;
  readonly unknownCount: number;
}

export interface ReconciledItem {
  readonly item: string;
  readonly delivered?: number;
  readonly used: number;
  readonly expectedEnd?: number;
  readonly actualEnd?: number;
  readonly delta?: number;
  readonly status: Status;
}

export interface DeliveryParseResult {
  readonly delivered: DeliveryMap;
  readonly warnings: string[];
}

export interface AuditReport {
  readonly items: ReconciledItem[];
  readonly summary: AuditSummary;
  readonly executedAt: string;
}
