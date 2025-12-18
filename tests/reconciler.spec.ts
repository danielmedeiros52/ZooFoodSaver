import { reconcileStock } from '../src/audit/domain/reconciler';

describe('reconcileStock', () => {
  it('returns OK when expected matches actual', () => {
    const result = reconcileStock({ banana: 30 }, { banana: 5 }, { banana: 25 });
    expect(result[0]).toMatchObject({ status: 'OK', expectedEnd: 25, actualEnd: 25 });
  });

  it('returns DISCREPANCY with correct delta', () => {
    const result = reconcileStock({ banana: 30 }, { banana: 5 }, { banana: 20 });
    expect(result[0]).toMatchObject({ status: 'DISCREPANCY', expectedEnd: 25, actualEnd: 20, delta: -5 });
  });

  it('marks UNKNOWN when delivery is missing', () => {
    const result = reconcileStock({}, { banana: 5 }, { banana: 20 });
    expect(result[0].status).toBe('UNKNOWN');
  });

  it('marks UNKNOWN when inventory entry is missing', () => {
    const result = reconcileStock({ banana: 30 }, { banana: 5 }, {});
    expect(result[0].status).toBe('UNKNOWN');
  });
});