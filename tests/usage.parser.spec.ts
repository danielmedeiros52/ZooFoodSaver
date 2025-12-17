import { UsageParser } from '../src/audit/parsers/usage.parser';

describe('UsageParser', () => {
  it('aggregates quantities by food', () => {
    const parser = new UsageParser();
    const csv = 'food,quantity\nbanana,2\nbanana,3\napple,1';
    const result = parser.parse(csv);
    expect(result).toEqual({ banana: 5, apple: 1 });
  });
});
