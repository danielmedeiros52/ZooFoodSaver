import { Test } from '@nestjs/testing';
import { AuditModule } from '../src/audit/audit.module';
import { AuditService } from '../src/audit/audit.service';
import { FileSystemService } from '../src/audit/infra/file-system.service';

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
    const moduleRef = await Test.createTestingModule({
      imports: [AuditModule],
    })
      .overrideProvider(FileSystemService)
      .useValue(
        new InMemoryFileSystem({
          delivery: 'banana=50\napple="30"\nkiwi=abc',
          usage: 'food,quantity\nbanana,20\napple,5\nbanana,5',
          inventory: '[{"item":"banana","quantity":25},{"item":"apple","quantity":20}]',
        }),
      )
      .compile();

    const auditService = moduleRef.get(AuditService);
    const report = await auditService.run({ deliveryPath: 'delivery', usagePath: 'usage', inventoryPath: 'inventory' });

    expect(report).toContain('banana');
    expect(report).toContain('DISCREPANCY');
    expect(report).toContain('UNKNOWN');
    expect(report).toContain('Summary');
  });
});