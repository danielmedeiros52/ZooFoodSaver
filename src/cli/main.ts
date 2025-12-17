import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { AuditService } from '../audit/audit.service';
import { parseArgs } from './args';

async function bootstrap(): Promise<void> {
  const logger = new Logger('CLI');
  let appContext: INestApplicationContext | undefined;
  try {
    const args = parseArgs(process.argv.slice(2));
    appContext = await NestFactory.createApplicationContext(AuditModule, { logger });
    const auditService = appContext.get(AuditService);
    const report = await auditService.run({
      deliveryPath: args.delivery,
      usagePath: args.usage,
      inventoryPath: args.inventory,
    });

    // eslint-disable-next-line no-console
    console.log(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Audit failed: ${message}`);
    process.exitCode = 1;
  } finally {
    if (appContext) {
      await appContext.close();
    }
  }
}

void bootstrap();
