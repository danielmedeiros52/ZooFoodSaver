import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { AuditService } from '../audit/audit.service';
import { parseArgs } from './args';

async function bootstrap(): Promise<void> {
  const logger = new Logger('CLI');
  try {
    const args = parseArgs(process.argv.slice(2));
    const appContext = await NestFactory.createApplicationContext(AuditModule, { logger });
    const auditService = appContext.get(AuditService);
    const report = await auditService.run({
      deliveryPath: args.delivery,
      usagePath: args.usage,
      inventoryPath: args.inventory,
    });

    // eslint-disable-next-line no-console
    console.log(report);
    await appContext.close();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Audit failed: ${message}`);
    process.exitCode = 1;
  }
}

void bootstrap();
