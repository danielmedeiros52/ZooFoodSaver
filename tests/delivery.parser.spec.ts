import { DeliveryParser } from '../src/audit/parsers/delivery.parser';

describe('DeliveryParser', () => {
  let parser: DeliveryParser;

  beforeEach(() => {
    parser = new DeliveryParser();
  });

  it('parses simple numeric values', () => {
    const result = parser.parse('banana=10');
    expect(result.delivered).toEqual({ banana: 10 });
    expect(result.warnings).toHaveLength(0);
  });

  it('parses quoted numeric values', () => {
    const result = parser.parse('banana="20"');
    expect(result.delivered).toEqual({ banana: 20 });
  });

  it('treats empty value as missing', () => {
    const result = parser.parse('banana=');
    expect(result.delivered).toEqual({ banana: undefined });
    expect(result.warnings).toHaveLength(1);
  });

  it('treats invalid value as missing and warns', () => {
    const result = parser.parse('banana=abc');
    expect(result.delivered).toEqual({ banana: undefined });
    expect(result.warnings[0]).toContain('invalid');
  });
});
