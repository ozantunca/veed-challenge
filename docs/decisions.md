# Architecture decisions

Format: short ADR-style notes. New decisions append to the bottom with a date.

## ADR-001 — SQLite with a `VideoRepository` interface (2026-04-20)

**Context**: We need durable local storage beyond a JSON file, without running a separate database server.

**Decision**: Use SQLite via `better-sqlite3` behind a `VideoRepository` interface (`list`, `create`).

**Consequences**: Simple deployment and backups (single file). The interface keeps persistence swappable for tests (`:memory:`) and future changes (e.g. Postgres).

## ADR-002 — Display IDs vs internal IDs (2026-04-20)

**Context**: Seed data uses identifiers like `v-001`; SQLite uses integer primary keys.

**Decision**: Store numeric IDs internally; render user-facing IDs as `v-` plus a left-padded numeric part with minimum width 3 (`v-001`, `v-050`, `v-1000`).

**Consequences**: Sorting and joins use integers; presentation stays aligned with the seeded format.

## ADR-003 — Server Components + `revalidatePath` instead of react-query (2026-04-20)

**Context**: The list page is read-heavy and benefits from server rendering.

**Decision**: Fetch the list in a Server Component. After create, call `revalidatePath("/")` in the API route and navigate with `router.refresh()` on the client.

**Consequences**: No client cache library is required for MVP. If we add complex client-side filtering or optimistic updates later, we can introduce react-query deliberately.

## ADR-004 — Zustand scope (2026-04-20)

**Context**: The starting prompt lists Zustand as a preferred tool.

**Decision**: Use Zustand only for transient UI state (toast queue), not for server data.

**Consequences**: Avoids duplicating server state on the client while still demonstrating Zustand usage.

## ADR-005 — Shared Zod schemas (2026-04-20)

**Context**: API and forms must agree on validation rules.

**Decision**: Centralize Zod schemas and reuse them in Route Handlers and `react-hook-form` resolvers.

**Consequences**: Single source of truth; fewer mismatches between client and server validation.

## ADR-006 — Drizzle ORM for schema and migrations (2026-04-20)

**Context**: `CREATE TABLE IF NOT EXISTS` in code does not version migrations; schema evolution needs a repeatable path.

**Decision**: Define tables in `lib/db/schema.ts` with Drizzle; commit generated SQL under `drizzle/`; run migrations at startup via `drizzle-orm/better-sqlite3/migrator` (wrapped in `lib/db/run-migrations.ts`). Keep raw `better-sqlite3` in `VideoRepository` for now; the schema is the source of truth for new migrations.

**Consequences**: Use `pnpm db:generate` after schema changes. Existing repos with an older DB are supported on first boot by using `CREATE TABLE IF NOT EXISTS` in the baseline migration (0000).
