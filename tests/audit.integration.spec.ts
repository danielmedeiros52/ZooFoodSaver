import { AuditService } from '../src/audit/audit.service';
import { FileSystemService } from '../src/audit/infra/file-system.service';
import { DeliveryParser } from '../src/audit/parsers/delivery.parser';
import { UsageParser } from '../src/audit/parsers/usage.parser';
import { InventoryParser } from '../src/audit/parsers/inventory.parser';
import { ReportFormatter } from '../src/audit/report/report.formatter';

class InMemoryFileSystem extends FileSystemService {
  constructor(private readonly files: Record<string, string>) {
    super();
  }

  async readFile(path: string): Promise<string> {
    const content = this.files[path];
    if (content === undefined) {
      throw new Error(`File not found: ${path}`);
    }
    return content;
  }
}

describe('AuditService integration', () => {
  it('produces a full report with mixed statuses', async () => {
    const auditService = new AuditService(
      new DeliveryParser(),
      new UsageParser(),
      new InventoryParser(),
      new InMemoryFileSystem({
        delivery: 'banana=50\napple="30"\nkiwi=abc',
        usage: 'food,quantity\nbanana,20\napple,5\nbanana,5',
        inventory: '[{"item":"banana","quantity":25},{"item":"apple","quantity":20}]',
      }),
      new ReportFormatter(),
    );
    const result = await auditService.run({ deliveryPath: 'delivery', usagePath: 'usage', inventoryPath: 'inventory' });

    expect(result.textReport).toContain('banana');
    expect(result.textReport).toContain('DISCREPANCY');
    expect(result.textReport).toContain('UNKNOWN');
    expect(result.textReport).toContain('SUMMARY');
    expect(result.textReport).toContain('Executed at');
    expect(result.warnings).toContain('Line 3 (kiwi): invalid or missing value \'abc\'');
    expect(result.report.summary.total).toBe(2);
    expect(new Date(result.report.executedAt).toString()).not.toBe('Invalid Date');
  });
});
