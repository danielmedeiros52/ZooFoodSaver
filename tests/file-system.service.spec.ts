import { FileSystemService } from '../src/audit/infra/file-system.service';

describe('FileSystemService', () => {
  it('wraps errors with file path context', async () => {
    const service = new FileSystemService();
    await expect(service.readFile('nonexistent-file.txt')).rejects.toThrow('Failed to read file nonexistent-file.txt');
  });
});