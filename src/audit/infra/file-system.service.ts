import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';

@Injectable()
export class FileSystemService {
  async readFile(path: string): Promise<string> {
    try {
      return await fs.readFile(path, 'utf-8');
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to read file ${path}: ${reason}`);
    }
  }
}