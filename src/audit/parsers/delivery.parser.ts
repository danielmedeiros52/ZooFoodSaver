import { Injectable, Logger } from '@nestjs/common';
import { DeliveryMap, DeliveryParseResult } from '../../@types/audit';

@Injectable()
export class DeliveryParser {
  private readonly logger = new Logger(DeliveryParser.name);

  parse(content: string): DeliveryParseResult {
    const delivered: DeliveryMap = {};
    const warnings: string[] = [];

    const lines = content.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index].trim();
      if (line.length === 0) {
        continue;
      }
      const separatorIndex = line.indexOf('=');
      if (separatorIndex === -1) {
        warnings.push(`Line ${index + 1}: missing '=' separator`);
        continue;
      }
      const key = line.substring(0, separatorIndex).trim();
      const rawValue = line.substring(separatorIndex + 1).trim();

      if (!key) {
        warnings.push(`Line ${index + 1}: empty key`);
        continue;
      }

      const normalized = this.normalizeValue(rawValue);
      if (normalized === undefined) {
        warnings.push(`Line ${index + 1} (${key}): invalid or missing value '${rawValue}'`);
      }

      delivered[key] = normalized;
    }

    warnings.forEach((warning) => this.logger.warn(warning));
    return { delivered, warnings };
  }

  private normalizeValue(value: string): number | undefined {
    if (value.length === 0) {
      return undefined;
    }
    const trimmed = this.unwrapQuotes(value);
    const parsed = Number(trimmed);

    if (!Number.isFinite(parsed) || parsed < 0) {
      return undefined;
    }

    return parsed;
  }

  private unwrapQuotes(value: string): string {
    if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
      return value.substring(1, value.length - 1);
    }
    return value;
  }
}
