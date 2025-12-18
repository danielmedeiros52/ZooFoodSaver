import { Injectable } from '@nestjs/common';
import { InventoryMap } from '../domain/types';

interface InventoryEntry {
  readonly item: string;
  readonly quantity: number;
}

@Injectable()
export class InventoryParser {
  parse(content: string): InventoryMap {
    const parsed = JSON.parse(content) as InventoryEntry[];
    const inventory: InventoryMap = {};

    for (const entry of parsed) {
      if (!entry.item || !Number.isFinite(entry.quantity) || entry.quantity < 0) {
        continue;
      }
      inventory[entry.item] = entry.quantity;
    }

    return inventory;
  }
}