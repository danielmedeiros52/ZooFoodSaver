# The Great Banana Mystery – Audit CLI

Simple NestJS-powered CLI that reconciles food deliveries, usage logs and inventory snapshots to flag discrepancies for zoo kitchens.

## Getting started

Prerequisites: Node.js 18+ and npm. Dependencies are defined in `package.json`.

```bash
npm install
npm run build
npm run audit -- --delivery ./data/delivery.txt --usage ./data/usage.csv --inventory ./data/inventory.json
```

The CLI prints the report to stdout and exits with non-zero status when files cannot be read or arguments are missing. Delivery parsing warnings are logged but do not stop execution.

## Architecture

- **CLI layer (`src/cli`)**: argument parsing and Nest application context bootstrap.
- **Audit module (`src/audit`)**
  - `domain`: pure reconciliation logic and shared types.
  - `parsers`: input parsers/aggregators for delivery, usage, and inventory.
  - `report`: textual formatter for deterministic output.
  - `infra`: file-system adapter (async, promise-based).
  - `audit.service`: orchestration use-case wiring parsers -> reconciler -> report.
- **Tests (`tests/`)**: Jest unit specs for parsers, reconciler, and a light integration using in-memory file system.

Design choices:
- Keep reconciliation pure/deterministic for easy testing.
- Defensive parsing with clear warnings for bad delivery values while keeping execution resilient.
- Minimal dependencies: NestJS only for DI/testing; everything else is plain TypeScript.

## Assumptions
- Delivery keys are well-formed; invalid/empty values are treated as missing and warned.
- Usage and inventory files are syntactically valid as provided.
- Missing delivered or inventory entries lead to `UNKNOWN` status.

## Trade-offs
- Argument parsing is intentionally simple (no external parsing lib) to avoid extra dependencies.
- Report is plain text for portability; no JSON export added to keep scope tight.

## Next steps
- Add optional JSON output flag for machine consumption.
- Add stricter schema validation for CSV/JSON inputs.
- Include configurable sorting/filters for large inventories.

## Assignment feedback
The focused CLI requirement kept the solution lean. NestJS for DI in a CLI felt slightly heavyweight but worked fine once scoped to a single module.
