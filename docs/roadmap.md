# Roadmap

## Milestone 1 — MVP (current)

- [x] Local SQLite database; populate with `pnpm seed` from `videos.json` at repo root (DB files gitignored).
- [x] Video list in a responsive grid with title, created date, tags, and user-facing IDs.
- [x] Sort by created date via a dropdown (newest / oldest) reflected in the URL.
- [x] Create video form with required title and optional tags; defaults for other fields.
- [x] API validation, structured errors, loading and error UI patterns.
- [x] Unit tests for core utilities and repository behavior; end-to-end tests for primary flows.

## Milestone 2 — Quality & accessibility

- [x] Full keyboard support for the tag chip input (focus order, aria labels, escape behavior).
- [x] Broader accessibility review (contrast, landmarks, reduced motion preferences).

## Milestone 3 — Library features

- [x] Edit and delete videos.
- [x] Search and filter (by title, tag, date range).

## Milestone 4 — Media features

- [x] Add support for attaching multiple video files to a single video record.
- [x] Store attached files under a local `cloud-storage` folder (gitignored).
- [x] Introduce a storage interface with async methods (`list`, `download`, `upload`) implemented against `cloud-storage`.
- [x] Keep app code calling only the storage interface so a real cloud backend can replace local storage later without broad refactors.

## Milestone 5 — Personal creation workflow

- [ ] Reframe the app toward a personal video creation + management tool (copy, docs, video detail workflow).
- [ ] Add a `description` field to the video schema and UI so agent prompts have richer context.
- [ ] Bootstrap Hyperframes Claude skill path via `pnpm i` / `postinstall` (optional `VEED_HYPERFRAMES_SKILL_GIT` clone; stub otherwise) — see [agent-workflow](./agent-workflow.md).
- [ ] One-shot **`claude -p`** from the UI with title/description/tags; poll until `composition/index.html` is ready; **`hyperframes preview`** opens the browser (no render/export in this milestone).
- [ ] Deferred: handoff to import rendered video files into attachments (revisit after a render pipeline exists).
