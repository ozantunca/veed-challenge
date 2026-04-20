# Project roadmap and milestone discussion
_Exported on 20/04/2026 at 18:12:33 GMT+3 from Cursor (3.1.15)_

---

**User**

let's brainstorm on our @docs/roadmap.md .
milestone 2 makes sense in general.
milestone 3 is also good but we can drop authentication for now

we can refactor milestone 4 as follows:
- ability to upload or attachi video files to a video record. each record can have multiple video files
- these files will be stored in a folder called `cloud-storage` which will be `.gitignore`d. 
- there will be a storage interface that will expose async methods like `list`, `download`, `upload` which will perform those functions on `cloud-storage` folder. the idea here is that this folder will be replaced with an actual cloud storage later without refactoring files other than the interface

milestone 5:
instead of treating this project as library of existing videos, we will treat this as a personal video creation/management tool. the creation part will be achieved using a local coding agent such as Cursor Agent CLI or Claude Code with Hyperframes (https://github.com/heygen-com/hyperframes ) skill. we need a new `pnpm` command for setting this up. 
there will be a button in our interface to launch the chosen coding agent with a given skill, title, and basic description of the video (description will be a new field in our SQL schema). we will then need a way to be able to get eventual video generated and save it in our storage. I'm not exactly sure how we can achieve this right now but let's discuss it

---

**Cursor**

Aligning your roadmap notes into a concrete Milestone 4/5 proposal first, then I’ll suggest an implementation path for the “agent generates video -> save to storage” loop so we can decide what to lock in.

I’ve got enough context from the current roadmap; next I’m checking the product/index docs briefly so Milestone 5 language stays consistent with the project direction before I draft edits.

I’m going to update `docs/roadmap.md` now to reflect your Milestone 3 auth removal, the storage-interface-first Milestone 4, and a new Milestone 5 focused on agent-driven video creation workflows.

I made one extra Milestone 3 suggestion while editing; I’m reverting that now so the roadmap strictly reflects your stated changes only.

Updated `docs/roadmap.md` with your requested direction:

- Milestone 3 keeps edit/delete + search/filter, and drops auth.
- Milestone 4 is now storage-interface-first with multi-file attachments per video and local `cloud-storage` backing.
- Added Milestone 5 for agent-assisted video creation (including new `description` field and agent launch flow).
- Non-goals now keep auth deferred and no longer frame upload/hosting as permanently out of scope.

For the Milestone 5 “how do we get generated video back into app storage?” piece, this is the cleanest path:

- **Agent output contract:** require agent runs to write results into a known local folder like `./generated-videos/<jobId>/`.
- **Job record in DB:** add a `video_generation_jobs` table (`id`, `video_id`, `agent`, `status`, `output_path`, `error`, timestamps).
- **UI launch action:** button creates a pending job and runs a local command with args (`title`, `description`, `skill`, `jobId`).
- **Ingestion step:** once output appears, app calls storage interface `upload(...)` to copy artifacts into `cloud-storage`, then creates video-file rows linked to the video record.
- **Status handling:** poll job status from UI (`queued/running/completed/failed`) and show “Attach output” (manual first), then automate later.

Suggested scripts to introduce in a follow-up implementation:

- `pnpm agent:setup` → checks/install prerequisites and scaffolds expected folders.
- `pnpm agent:run --agent=<cursor|claude> --skill=<...> --title=... --description=... --jobId=...` → launches generation workflow.
- `pnpm agent:ingest --jobId=...` → imports produced files via storage interface.

If you want, next step I can implement Milestone 4’s foundations now (storage interface + `cloud-storage` + schema for multiple files per video), then scaffold the Milestone 5 job model and scripts.

---

**User**

very good. let's plan milestone 2, 3,  and 4

---

**Cursor**

I’ll map Milestones 2/3/4 to the current code structure first, then propose an execution plan with file-level steps and sequencing.

I found all the relevant code paths; before I lock the plan, I need two product decisions that materially change implementation order and API shape.

**Milestones 2-4 planning decisions**

> **For Milestone 2, what should be our primary strategy when the list grows large?**
> - Implement URL-based pagination first (page/limit), consider virtualization later only if needed ✔
> - Implement client-side virtualization first, keep pagination out for now
> - Do both in Milestone 2 (pagination in API + virtualization in UI)

> **For Milestone 3, which UX direction should we plan around?**
> - Simple-first: dedicated edit page + per-card delete action + filters in toolbar (title text, tag single-select, date range) ✔
> - Power-first: inline edit and bulk actions in list + advanced filters
> - Mixed: dedicated edit page, bulk delete later, start with basic filters

---

**User**

read the plan and comment on it

---

**Cursor**

Overall it's solid and the delivery order is right. A few observations:

**Things that are well-structured:**
- The delivery sequence is good — a11y first because it touches existing components, pagination second because filters in M3 will piggyback on the same query-param pipeline, data-layer before UI in M3.
- The architectural notes are clean — URL as source of truth for filters/pagination is consistent with how sort already works and will make the filter toolbar easy to test without mocking.
- The storage interface design correctly separates metadata (SQLite/repository) from bytes (`lib/storage/*`), which mirrors the spirit of ADR-001.

**A few gaps or things worth deciding now:**

1. **`video_attachments` table will cause a migration challenge.** The current `migrate.ts` uses `CREATE TABLE IF NOT EXISTS`, which means adding the new table at startup is fine — but there's no versioned migration system. Once `cloud-storage` is in play (and the app has run before), any new column or table change that the `IF NOT EXISTS` pattern doesn't catch could silently not apply. Worth noting we may want to either add a simple version table or at minimum document that developers need to delete their local DB to pick up schema changes.

2. **Edit/delete non-goal conflict.** The roadmap's non-goals section still says `- Edit/delete flows.` at line 46. That was deferred from the original scope but is now explicitly in M3. We should remove it from non-goals when we start M3.

3. **Storage interface: `download` as stream vs buffer.** For local use, returning a `Buffer` or piping a `ReadableStream` to a Next.js `Response` are both fine, but this choice has API implications before we commit. The current project has no streaming setup. A pragmatic first pass: `upload` takes a `Buffer`, `download` returns a `Buffer`, `list` returns object metadata. Simple enough to swap to streams or presigned URLs at M5.

4. **The filter toolbar placement on the home page may conflict with pagination.** If filters live in the URL and reset pagination on change, we need a clear convention (e.g. changing any filter resets `page` to 1). Worth a small note in the plan — it's easy to implement, but easy to forget.

5. **No video detail page planned.** Attachment management is attached to list/edit flows ("minimal first: upload + list existing files"), but it's vague about where the attachment list lives. A detail page (`app/videos/[id]/page.tsx`) would be the cleanest home for it, and it's also needed for the edit route anyway (`app/videos/[id]/edit/page.tsx`). The detail page would sit naturally between the list card and the edit form.

Want me to update the plan to address any of these, or shall we proceed to implementation?

---

**User**

1. should we migrate to something like prisma already to support schema migration?
2. remove the non-goal section altogether
3. sounds good
4. maybe it's okay to ignore pagination altogether right now. remove it from the existing plan
5. edit and detail pages would have different interface i presume? the detail page sounds fairly simple right now but why not

---

**Cursor**

Good decisions across the board. Let me address point 1 with a quick recommendation before updating the plan, since it has a meaningful architecture impact.

On **point 1**, there are three realistic options for a local-first `better-sqlite3` project:

- **Prisma** — full ORM, type-safe client, migration files via `prisma migrate dev`. Most powerful, but adds a generated client, a separate schema file, and makes the existing `VideoRepository` pattern partially redundant since Prisma becomes its own abstraction. It's also heavier for a local-first SQLite project.
- **Drizzle ORM** — TypeScript-first, schema-as-code in TypeScript files, lightweight migration runner, works directly with `better-sqlite3`, and plays nicely with the existing repository pattern (repository methods can still call Drizzle query builder). The clean option if you want migrations without giving up control.
- **Simple version table** — add a `schema_version` table + numbered migration functions (e.g. `migration_001`, `migration_002`) executed in order at startup. Zero new dependencies, fits in `migrate.ts`, but requires a bit of manual scaffolding.

> **Which migration strategy should we adopt?**
> - Drizzle ORM — TypeScript schema, lightweight migration runner, keeps repository pattern intact ✔
> - Prisma — full ORM with migration files, type-safe generated client
> - Simple version table — no new deps, numbered migrations in migrate.ts

Good choice. Now updating the plan with all five changes: Drizzle migration, removing non-goals mention, keeping download as Buffer, dropping pagination, and adding detail + edit pages as distinct interfaces.

Plan updated. Here's a summary of what changed:

1. **Drizzle ORM** added as step 0 — schema-as-code in `lib/db/schema.ts`, `drizzle-kit` for migration generation, startup runner replaces the current `migrate()` call. Keeps the repository pattern untouched, just uses Drizzle's query builder under the hood.
2. **Non-goals note removed** from the plan (and we should strip the edit/delete line from `docs/roadmap.md` non-goals when we start M3 — queued in the data-layer todo).
3. **Pagination dropped entirely** — no page/limit in repository, API, or UI for now.
4. **Detail page added** (`VideoDetailPage.tsx`) as a distinct read-only surface for metadata and attachments. Edit page (`VideoEditPage.tsx`) is a form-only view. The two are linked but intentionally separate since their content and intent differ.
5. **Storage `download`/`upload`** confirmed as `Buffer`-based for now, noted as easy to swap in M5.

Ready to start implementation whenever you say go.

---

**User**

implement foundation step and wait for my command to continue

---

**Cursor**


Implementing the Drizzle foundation: exploring the DB layer and repository to migrate it cleanly.




Installing Drizzle, adding the schema and migration runner, and generating the initial migration.




Using Drizzle's `drizzle()` wrapper for migrations — the migrator expects a Drizzle database instance, not a raw `better-sqlite3` connection.




Foundation step is in place. Here’s what was done:

### Done

- **Dependencies:** `drizzle-orm`, `drizzle-kit` (already installed earlier).
- **Schema:** [lib/db/schema.ts](lib/db/schema.ts) — `videos` table matches the previous columns.
- **Config:** [drizzle.config.ts](drizzle.config.ts) — SQLite, schema at `./lib/db/schema.ts`, migrations in `./drizzle`.
- **Migrations:** [drizzle/0000_conscious_wild_pack.sql](drizzle/0000_conscious_wild_pack.sql) — `CREATE TABLE IF NOT EXISTS` so an existing DB from the old `migrate.ts` path doesn’t break on first run with Drizzle.
- **Runtime:** [lib/db/run-migrations.ts](lib/db/run-migrations.ts) — builds `drizzle()` with the schema, then runs `migrate()` from `drizzle-orm/better-sqlite3/migrator` (raw `better-sqlite3` alone is not enough).
- **Compatibility:** [lib/db/migrate.ts](lib/db/migrate.ts) — `export { runMigrations as migrate }` so [get-db.ts](lib/db/get-db.ts), [scripts/seed.ts](scripts/seed.ts), and tests stay the same.
- **Scripts:** `pnpm db:generate` in [package.json](package.json).
- **Docs:** ADR-006 in [docs/decisions.md](docs/decisions.md); README updated for Drizzle + `db:generate`.
- **Checks:** `pnpm test`, `pnpm build`, `pnpm lint`, `tsc --noEmit`, and `VIDEO_DB_PATH=/tmp/test-seed.db pnpm seed` all succeed.

`SqliteVideoRepository` is unchanged (still raw SQL); the next milestones can switch it to Drizzle queries when you want.

---

**Paused** until you say to continue with Milestone 2 (a11y) or anything else.

If anything in the plan file still lists the old pagination todo, you can mark **`drizzle-foundation`** done manually in `.cursor/plans/milestones-2-4_execution_plan_88edf470.plan.md`.

---

**User**

can we run `db:generate` or `seed` commands before every deploy or would they mess with anything?

---

**Cursor**


Checking how `seed` behaves so we can give an accurate answer.




Here’s a concise breakdown for **this** project.

### `pnpm db:generate` (Drizzle Kit `generate`)

- **Purpose:** Compare `lib/db/schema.ts` to what Drizzle already knows and **write new migration SQL** under `drizzle/` when the schema changed.
- **On every deploy:** Usually **not what you want** in CI/deploy:
  - Migrations should be **generated when you change the schema**, then **committed**. Deploy should **apply** existing migrations (what `runMigrations` does at app startup), not create new ones.
  - Running `generate` in deploy can produce **uncommitted** migration files, surprise diffs, or confusion if anything in the environment doesn’t match dev.
- **Bottom line:** Treat `db:generate` as a **local/dev (or PR) step** when editing `schema.ts`, not a standard deploy step.

---

### `pnpm seed`

From the code, `seedVideosFromJson` **deletes every row in `videos`** and then inserts from `data/videos.json`:

```38:38:lib/db/seed-videos.ts
  db.prepare("DELETE FROM videos").run();
```

- **On every deploy:** That would **wipe the database’s videos** and replace them with the JSON fixture **every time**. Fine only for **throwaway/demo** environments where you always want the canned dataset. **Bad** for any environment where users create or edit videos—you’d lose their data on each deploy.
- **Bottom line:** Run **seed only** for first-time local setup / intentional resets / demo resets—not as a default production deploy hook.

---

### What *does* belong on deploy?

- **Migrations:** Your app already runs `runMigrations` when opening the DB (see `get-db` + `migrate`). That **applies** committed SQL under `drizzle/`—no need to run `db:generate` for that.
- **Optional:** A separate `drizzle-kit migrate` or custom “apply migrations” step **if** you didn’t run migrations at process start—here you **do**, so deploy is mostly “ship code + committed migrations.”

**Summary:** Don’t run `db:generate` on every deploy; don’t run `seed` on every deploy unless you explicitly want a full **reset** to `videos.json` each time.

---

**User**

do we run them at all then or do they run automatically during start?

---

**Cursor**


Here’s how it breaks down:

### Migrations (**apply** — the SQL in `drizzle/`)

They run **automatically**, not as a separate deploy script.

On first use of the DB in a running process, `getDb()` opens SQLite and calls `migrate(db)`, which runs Drizzle’s migrator against the `drizzle/` folder:

```12:26:lib/db/get-db.ts
export function getDb(): Database.Database {
  if (!globalForDb.videoDb) {
    // ... path setup ...
    const db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    migrate(db);
    globalForDb.videoDb = db;
  }
  return globalForDb.videoDb;
}
```

So **`pnpm start` / `next dev` doesn’t need a separate “migrate” step** for normal operation: the first API route or server code that touches the repo/DB triggers `getDb()` and migrations apply then.

What **does not** run automatically: **`pnpm db:generate`**. That only **creates** new migration files from `schema.ts` when you change the schema; you run that locally (or in CI only if you have a special workflow), then commit the new files.

---

### Seed (`pnpm seed`)

**Not** automatic on start. You run **`pnpm seed` yourself** when you want to wipe/replace rows from `data/videos.json` (e.g. first local setup or a deliberate reset).

---

**Short version:** Applied migrations run on first DB open via `getDb()`. `db:generate` is manual. `seed` is manual.

---

**User**

@/Users/ozantunca/PersonalProjects/veed-challenge/lib/db/schema.ts:4 dont we need starting integer here? 

---

**Cursor**


No — you don’t put a “starting integer” on that line in the Drizzle schema.

`integer("id").primaryKey({ autoIncrement: true })` matches SQLite’s usual pattern: the column is an auto-incrementing integer primary key. **Where counting starts** isn’t declared in the schema file; it’s whatever SQLite’s sequence says after inserts:

- **Fresh DB, no rows:** the first auto-generated id is typically **1** (unless you’ve changed the sequence).
- **Your seed path:** `seedVideosFromJson` inserts **explicit** `id` values from the JSON (`fromDisplayId(v.id)`), then `syncAutoincrementSequence` updates the internal sequence so the **next** `INSERT` without an id gets something like **51** after 50 seeded rows. That’s all in application/seed code, not in `schema.ts`.

So line 4 is correct as-is. Adding something like `.default(1)` on `id` would be the wrong model for an identity column. If you ever needed a DB-specific “sequence starts at N,” that would be done with SQL/migration tweaks or inserts — not a “starting integer” parameter on the Drizzle `integer()` definition.

---

**User**

alrighty. commit the current changes and continue to milestone 3

---

**Cursor**


Committing current changes, then implementing Milestone 3 (edit/delete, filters, detail and edit pages).




Staging and committing changes, then implementing Milestone 3.




Implementing Milestone 3: adding the `description` column and generating migration.




Implementing repository, validation, parsing utilities, API routes, and UI components.




Here’s what was committed and implemented.

### Commits (on `ai/accessibility`)
1. **`1dd4734`** — Drizzle foundation (already on the branch from before).
2. **`8afd62e`** — **Milestone 3** — filters, CRUD, detail/edit, `description` column + migration `0001`.
3. **`9f4d7d9`** — Plan file: Drizzle + M3 todos marked completed.

### Milestone 3 highlights
- **`description`** — `lib/db/schema.ts`, migration [`drizzle/0001_ancient_midnight.sql`](drizzle/0001_ancient_midnight.sql), seed + create/update flows.
- **Repository** — `getById`, `update`, `delete`, and **list filters** (`titleContains`, `tag`, `createdFrom`, `createdTo`) in [`lib/repositories/sqlite-video-repository.ts`](lib/repositories/sqlite-video-repository.ts).
- **URL/helpers** — [`lib/parse-list-query.ts`](lib/parse-list-query.ts) wired from [`app/page.tsx`](app/page.tsx) and [`api/ListVideosRoute.ts`](api/ListVideosRoute.ts).
- **API** — [`GET`/`PATCH`/`DELETE` `app/api/videos/[id]/route.ts`](app/api/videos/[id]/route.ts) via [`api/GetVideoRoute.ts`](api/GetVideoRoute.ts), [`api/UpdateVideoRoute.ts`](api/UpdateVideoRoute.ts), [`api/DeleteVideoRoute.ts`](api/DeleteVideoRoute.ts); [`jsonNotFound`](lib/api/response.ts) / `jsonNoContent`.
- **UI** — [`VideoListFilters`](components/VideoListFilters.tsx), linked titles, **View** + **Delete** on cards, [`VideoDetailPage`](components/VideoDetailPage.tsx), [`VideoEditPage`](components/VideoEditPage.tsx), optional description on create ([`VideoCreatePage`](components/VideoCreatePage.tsx)).
- **Docs** — [`docs/roadmap.md`](docs/roadmap.md) M3 done; M5 “description” item checked; removed conflicting “Edit/delete” non-goal.

### Tests
`pnpm test`, `pnpm build`, `pnpm lint`, `pnpm test:e2e` all pass (including new E2E: open detail via **View**).

---

**Next:** Milestone 2 (a11y) or **Milestone 4** (storage + attachments) — say which you want next. Local DBs get **`description`** on next app start via Drizzle migrations; run **`pnpm seed`** if you want `data/videos.json` reloaded (still wipes and reseeds).

---

**User**

it appears i skipped over milestone 2 somehow. implement milestone 2 but do not commit before i say so

---

**Cursor**


Implementing Milestone 2 per the roadmap: reviewing targets and current code.




Implementing TagChipInput keyboard/ARIA improvements, skip link + `<main>`, reduced-motion CSS, Toaster roles, and a brief ADR for the pagination decision. Updating the roadmap (uncommitted).




Milestone 2 is implemented locally; **nothing has been committed** (per your request).

### What changed

1. **`TagChipInput`** ([`components/TagChipInput.tsx`](components/TagChipInput.tsx))  
   - Stable `id` handling (`id` prop or `useId()`).  
   - **Escape**: clears non-empty draft; if draft is empty, blurs the field (no tag changes).  
   - **ARIA**: `aria-invalid`, `aria-describedby` → hint + error ids; `role="group"` + `aria-labelledby` when a label is shown; remove buttons use **focus-visible ring** (aligned with other controls).  
   - Hint text mentions Escape.

2. **Layout / landmarks** ([`app/layout.tsx`](app/layout.tsx))  
   - **Skip link** (visible on focus) → `#main-content`.  
   - **`main#main-content`** with `tabIndex={-1}` and a light focus ring when focused from skip.

3. **Reduced motion** ([`app/globals.css`](app/globals.css))  
   - `@media (prefers-reduced-motion: reduce)` shortens animations/transitions and sets `scroll-behavior: auto`.

4. **Contrast**  
   - Slightly darker **`--muted-foreground`** in light `:root` for small/helper copy.

5. **Toasts** ([`components/Toaster.tsx`](components/Toaster.tsx))  
   - Per-toast: `role="alert"` + `aria-live="assertive"` for destructive; `role="status"` + `polite` otherwise; `aria-atomic="true"`. Removed wrapping `aria-live` on the container to avoid double regions.

6. **Docs**  
   - [**ADR-007**](docs/decisions.md) — a11y baseline + why pagination/virtualization isn’t added yet.  
   - [**docs/roadmap.md**](docs/roadmap.md) — Milestone 2 items checked (third item notes deferral + ADR-007).

7. **Tests** ([`components/TagChipInput.test.tsx`](components/TagChipInput.test.tsx))  
   - Escape clears draft; `aria-invalid` / `aria-describedby` when `error` is set.

8. **Plan file** — `m2-a11y` marked completed in [`.cursor/plans/milestones-2-4_execution_plan_88edf470.plan.md`](.cursor/plans/milestones-2-4_execution_plan_88edf470.plan.md).

### Verification

`pnpm exec tsc --noEmit`, `pnpm test`, `pnpm test:e2e`, `pnpm lint`, and `pnpm build` all succeed.

When you’re ready, say so and we can stage/commit with a message you like.

---

**User**

looks good. commit it

---

**Cursor**


Created commit **`76ba7ec`** on `ai/accessibility` with:

- **Subject:** `Milestone 2: accessibility baseline (tags, landmarks, motion, toasts)`
- **Files:** 9 changed (TagChipInput + tests, layout, globals, Toaster, docs, roadmap, plan, README)

Working tree is clean.

---

**User**

let's implement milestone 4. dont commit until i say so

---

**Cursor**


Implementing Milestone 4: exploring the codebase and applying schema, storage layer, API routes, and UI.




Implementing the schema, storage layer, attachment repository, API routes, delete-video file cleanup, and detail UI.




Milestone 4 is implemented locally; **nothing is committed** yet.

### Data & migrations
- **[`lib/db/schema.ts`](lib/db/schema.ts)** — `video_attachments` with `video_id` → `videos(id)` **ON DELETE CASCADE**, unique `storage_key`.
- **[`drizzle/0002_wild_supernaut.sql`](drizzle/0002_wild_supernaut.sql)** — migration (run automatically on next app start).
- **[`lib/db/get-db.ts`](lib/db/get-db.ts)** — `PRAGMA foreign_keys = ON` so cascades apply.

### Storage port
- **[`lib/storage/storage.ts`](lib/storage/storage.ts)** — `MediaStorage`: `upload`, `download`, `list`, `remove`.
- **[`lib/storage/local-fs-storage.ts`](lib/storage/local-fs-storage.ts)** — files under a root path; path traversal guarded.
- **[`lib/storage/index.ts`](lib/storage/index.ts)** — `getMediaStorage()`; root from **`MEDIA_STORAGE_ROOT`** or default **`./cloud-storage`** (directory created if missing).

### Repository & helpers
- **[`lib/repositories/sqlite-attachment-repository.ts`](lib/repositories/sqlite-attachment-repository.ts)** + [`attachment-repository.ts`](lib/repositories/attachment-repository.ts).
- **[`lib/attachments/filename.ts`](lib/attachments/filename.ts)** — safe names + `makeAttachmentStorageKey`.
- **[`lib/types/video-attachment.ts`](lib/types/video-attachment.ts)**.
- **`attachmentIdParamSchema`** in [`lib/validation/video.ts`](lib/validation/video.ts); caps / MIME rules in [`lib/validation/attachment-upload.ts`](lib/validation/attachment-upload.ts).

### API
- **`GET` / `POST`** [`app/api/videos/[id]/attachments/route.ts`](app/api/videos/[id]/attachments/route.ts) — list & multipart upload (field **`file`**, max **100 MB**, `video/*` or `application/octet-stream`).
- **`DELETE`** [`app/api/videos/[id]/attachments/[attachmentId]/route.ts`](app/api/videos/[id]/attachments/[attachmentId]/route.ts).
- **`GET`** [`app/api/videos/[id]/attachments/[attachmentId]/file/route.ts`](app/api/videos/[id]/attachments/[attachmentId]/file/route.ts) — download.
- **[`api/DeleteVideoRoute.ts`](api/DeleteVideoRoute.ts)** — deletes attachment blobs from storage, then deletes the video (DB cascade cleans rows).

### UI
- **[`components/VideoAttachmentsPanel.tsx`](components/VideoAttachmentsPanel.tsx)** — upload, list, download, remove.
- **[`components/VideoDetailPage.tsx`](components/VideoDetailPage.tsx)** + [`app/videos/[displayId]/page.tsx`](app/videos/[displayId]/page.tsx) — load & pass `attachments`.

### Repo hygiene & e2e
- **[`.gitignore`](.gitignore)** — `/cloud-storage`, `/data/e2e-cloud-storage`.
- **[`playwright.config.ts`](playwright.config.ts)** + **[`e2e/global-setup.ts`](e2e/global-setup.ts)** — `MEDIA_STORAGE_ROOT` for e2e and cleanup.
- **[`README.md`](README.md)** — `MEDIA_STORAGE_ROOT` note.
- **[`docs/roadmap.md`](docs/roadmap.md)** — M4 items checked; **[`docs/decisions.md`](docs/decisions.md)** — **ADR-008**; plan todos for m4 marked done.

### Tests
- [`lib/attachments/filename.test.ts`](lib/attachments/filename.test.ts), [`lib/storage/local-fs-storage.test.ts`](lib/storage/local-fs-storage.test.ts), [`lib/repositories/sqlite-attachment-repository.test.ts`](lib/repositories/sqlite-attachment-repository.test.ts).
- **E2E**: detail flow asserts [`video-attachments`](e2e/library.spec.ts).

`pnpm exec tsc --noEmit`, `pnpm test`, `pnpm lint`, `pnpm build`, and `pnpm test:e2e` all pass.

When you’re happy with it, say **commit** and we can stage with a scoped message.

---

**User**

For the code present, we get this error:
```
Argument of type 'Buffer' is not assignable to parameter of type 'string | ArrayBufferView | Iterable<string | ArrayBufferView> | AsyncIterable<string | ArrayBufferView> | Stream'.
  Type 'Buffer' is not assignable to type 'Uint8Array<ArrayBufferLike> | DataView<ArrayBufferLike> | Iterable<string | ArrayBufferView> | AsyncIterable<...> | Stream'.
    Type 'Buffer' is not assignable to type 'Uint8Array<ArrayBufferLike>'.
      The types of 'slice(...).buffer' are incompatible between these types.
        Type 'ArrayBufferLike' is not assignable to type 'ArrayBuffer'.
          Type 'SharedArrayBuffer' is missing the following properties from type 'ArrayBuffer': resizable, resize, detached, transfer, transferToFixedLength
```
Fix it, verify, and then give a concise explanation. @lib/storage/local-fs-storage.ts:32-35 

---

**Cursor**


**Change:** `await fs.writeFile(full, new Uint8Array(data));`

**Verification:** `pnpm exec tsc --noEmit` exits 0. Unit tests for `LocalFsStorage` still pass.

**Why:** With current **TypeScript** + **@types/node**, `fs.promises.writeFile` is typed to accept `ArrayBufferView` variants whose underlying `ArrayBuffer` is a plain `ArrayBuffer`. **`Buffer`** is still a `Uint8Array` at runtime, but its typings expose `buffer` as `ArrayBufferLike` (including `SharedArrayBuffer`), so **`Buffer` no longer matches** that parameter type. Passing **`new Uint8Array(data)`** produces a **`Uint8Array`** that matches the expected type (at the cost of a **copy** of the bytes). If you want to avoid the copy, **`await fs.writeFile(full, data as Uint8Array)`** is also valid at runtime since `Buffer` is already a `Uint8Array` view.

---

**User**

looks good. commit it

---

**Cursor**


Created commit **`29f2a89`** on `master`:

**Subject:** `Milestone 4: video attachments and pluggable blob storage`  
**Scope:** 38 files, including the `video_attachments` migration, storage layer, attachment APIs, UI, docs, e2e, tests, and the `writeFile` `Uint8Array` fix in `local-fs-storage.ts`.

Working tree should be clean; say if you want a different branch or to tweak the message.

