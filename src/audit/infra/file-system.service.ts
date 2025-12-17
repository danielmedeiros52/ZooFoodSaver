import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';

@Injectable()
export class FileSystemService {
  async readFile(path: string): Promise<string> {
    return fs.readFile(path, 'utf-8');
  }
}
