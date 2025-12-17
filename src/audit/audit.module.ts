import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { DeliveryParser } from './parsers/delivery.parser';
import { UsageParser } from './parsers/usage.parser';
import { InventoryParser } from './parsers/inventory.parser';
import { FileSystemService } from './infra/file-system.service';
import { ReportFormatter } from './report/report.formatter';

@Module({
  providers: [AuditService, DeliveryParser, UsageParser, InventoryParser, FileSystemService, ReportFormatter],
  exports: [AuditService],
})
export class AuditModule {}
