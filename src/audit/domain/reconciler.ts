import { DeliveryMap, InventoryMap, ReconciledItem, Status, UsageMap } from '../../@types/audit';

function calculateExpected(delivered: number | undefined, used: number): number | undefined {
  if (delivered === undefined) {
    return undefined;
  }
  return delivered - used;
}

function determineStatus(expectedEnd: number | undefined, actualEnd: number | undefined): Status {
  if (expectedEnd === undefined || actualEnd === undefined) {
    return 'UNKNOWN';
  }
  if (expectedEnd === actualEnd) {
    return 'OK';
  }
  return 'DISCREPANCY';
}

export function reconcileStock(
  delivered: DeliveryMap,
  usage: UsageMap,
  actual: InventoryMap,
): ReconciledItem[] {
  const items = new Set<string>([...Object.keys(delivered), ...Object.keys(usage), ...Object.keys(actual)]);
  const results: ReconciledItem[] = [];

  for (const item of Array.from(items).sort()) {
    const deliveredValue = delivered[item];
    const usedValue = usage[item] ?? 0;
    const expectedEnd = calculateExpected(deliveredValue, usedValue);
    const actualEnd = actual[item];
    const status = determineStatus(expectedEnd, actualEnd);
    const delta = expectedEnd !== undefined && actualEnd !== undefined ? actualEnd - expectedEnd : undefined;

    results.push({
      item,
      delivered: deliveredValue,
      used: usedValue,
      expectedEnd,
      actualEnd,
      delta,
      status,
    });
  }

  return results;
}