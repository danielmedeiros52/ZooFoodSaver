import { Injectable } from '@nestjs/common';
import { UsageMap } from '../../@types/audit';

@Injectable()
export class UsageParser {
  parse(content: string): UsageMap {
    const usage: UsageMap = {};
    const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length === 0) {
      return usage;
    }

    const [, ...rows] = lines;
    for (const row of rows) {
      const [foodRaw, quantityRaw] = row.split(',').map((part) => part.trim());
      if (!foodRaw) {
        continue;
      }
      const quantity = Number(quantityRaw);
      if (!Number.isFinite(quantity) || quantity < 0) {
        continue;
      }
      usage[foodRaw] = (usage[foodRaw] ?? 0) + quantity;
    }

    return usage;
  }
}