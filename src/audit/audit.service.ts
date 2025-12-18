import { Injectable, Logger } from '@nestjs/common';
import { DeliveryParser } from './parsers/delivery.parser';
import { UsageParser } from './parsers/usage.parser';
import { InventoryParser } from './parsers/inventory.parser';
import { FileSystemService } from './infra/file-system.service';
import { reconcileStock } from './domain/reconciler';
import { buildAuditReport } from './domain/report';
import { AuditReport } from '../@types/audit';
import { ReportFormatter } from './report/report.formatter';

export interface AuditRequest {
  readonly deliveryPath: string;
  readonly usagePath: string;
  readonly inventoryPath: string;
}

export interface AuditRunResult {
  readonly report: AuditReport;
  readonly textReport: string;
  readonly warnings: string[];
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    private readonly deliveryParser: DeliveryParser,
    private readonly usageParser: UsageParser,
    private readonly inventoryParser: InventoryParser,
    private readonly fileSystem: FileSystemService,
    private readonly reportFormatter: ReportFormatter,
  ) {}

  async run(request: AuditRequest): Promise<AuditRunResult> {
    this.logger.log('Starting audit...');
    try {
      const [deliveryContent, usageContent, inventoryContent] = await Promise.all([
        this.fileSystem.readFile(request.deliveryPath),
        this.fileSystem.readFile(request.usagePath),
        this.fileSystem.readFile(request.inventoryPath),
      ]);

      const deliveryResult = this.deliveryParser.parse(deliveryContent);
      const usage = this.usageParser.parse(usageContent);
      const inventory = this.inventoryParser.parse(inventoryContent);

      const reconciled = reconcileStock(deliveryResult.delivered, usage, inventory);
      const report = buildAuditReport(reconciled);
      const textReport = this.reportFormatter.format(report);

      this.logger.log('Audit completed.');
      return { report, textReport, warnings: deliveryResult.warnings };
    } catch (error) {
      this.logger.error('Audit failed', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }
}