export interface CliArgs {
  readonly delivery: string;
  readonly usage: string;
  readonly inventory: string;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (current.startsWith('--')) {
      const key = current.substring(2);
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for argument ${current}`);
      }
      args[key] = value;
      i += 1;
    }
  }

  if (!args.delivery || !args.usage || !args.inventory) {
    throw new Error('Usage: --delivery <path> --usage <path> --inventory <path>');
  }

  return {
    delivery: args.delivery,
    usage: args.usage,
    inventory: args.inventory,
  };
}
