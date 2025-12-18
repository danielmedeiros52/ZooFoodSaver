# The Great Banana Mystery – Audit CLI

Simple NestJS-powered CLI that reconciles food deliveries, usage logs and inventory snapshots to flag discrepancies for zoo kitchens.

## Getting started

Prerequisites: Node.js 18+ and npm. Dependencies are defined in `package.json`.

### Setup

```bash
npm install
npm run build
```

### Run

Provide the three input files via flags (sample fixtures live in `./data`):

```bash
npm run audit -- --delivery ./data/delivery.txt --usage ./data/usage.csv --inventory ./data/inventory.json
```

The CLI prints the reconciliation report to stdout and exits with non-zero status when files cannot be read or required arguments are missing. Delivery parsing warnings are logged but do not stop execution.

### Example output

```
[Nest] ... LOG [AuditService] Starting audit...
[Nest] ... WARN [DeliveryParser] Line 3 (kiwi): invalid or missing value 'abc'
[Nest] ... LOG [AuditService] Audit completed.
=== AUDIT REPORT ===
Executed at: 2025-12-18T23:14:48.662Z

Item: apple
  Delivered: 30
  Used: 5
  Expected end: 25
  Actual end: 20
  Delta: -5
  Status: DISCREPANCY
Item: banana
  Delivered: 50
  Used: 25
  Expected end: 25
  Actual end: 25
  Delta: 0
  Status: OK
Item: kiwi
  Delivered: missing
  Used: 0
  Expected end: missing
  Actual end: missing
  Status: UNKNOWN

--- SUMMARY ---
Total items: 3
DISCREPANCIES: 1
UNKNOWN: 1
```

## Architecture

- **CLI layer (`src/cli`)**: argument parsing and Nest application context bootstrap.
- **Audit module (`src/audit`)**:
  - `domain`: pure reconciliation logic and shared types.
  - `parsers`: input parsers/aggregators for delivery, usage, and inventory.
  - `report`: textual formatter for deterministic output.
  - `infra`: file-system adapter (async, promise-based).
  - `audit.service`: orchestration use-case wiring parsers → reconciler → report.
- **Tests (`tests/`)**: Jest unit specs for parsers, reconciler, and a light integration using an in-memory file system.

### High-level decisions

- Favor pure domain logic to make reconciliation deterministic and easy to test.
- Keep NestJS usage minimal—only for DI/testing—so most code stays plain TypeScript.
- Treat the CLI as a thin composition layer; no global state is shared across runs.

## Assumptions
- Delivery keys are well-formed; invalid or empty values are warned and forwarded as `missing` so they surface as `UNKNOWN` in the report.
- Usage and inventory files are syntactically valid as provided.
- Missing delivered or inventory entries lead to an `UNKNOWN` status in the report.

## Trade-offs
- Argument parsing stays simple (no external parsing lib) to avoid extra dependencies.
- Report remains plain text for portability; JSON export was deferred to keep scope tight.
- Delivery parsing is tolerant by design to avoid failing the entire run on a single bad line.

## Next steps
- Add optional JSON output flag for machine consumption.
- Add stricter schema validation for CSV/JSON inputs.
- Include configurable sorting/filters for large inventories.

## Assignment feedback
The focused CLI requirement kept the solution lean. NestJS for DI in a CLI felt slightly heavyweight but worked fine once scoped to a single module.
