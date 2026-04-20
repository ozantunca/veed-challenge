# Roadmap

## Milestone 1 — MVP (current)

- [x] Local SQLite database; populate with `pnpm seed` from `data/videos.json` (DB files gitignored).
- [x] Video list in a responsive grid with title, created date, tags, and user-facing IDs.
- [x] Sort by created date via a dropdown (newest / oldest) reflected in the URL.
- [x] Create video form with required title and optional tags; defaults for other fields.
- [x] API validation, structured errors, loading and error UI patterns.
- [x] Unit tests for core utilities and repository behavior; end-to-end tests for primary flows.

## Milestone 2 — Quality & accessibility

- [ ] Full keyboard support for the tag chip input (focus order, aria labels, escape behavior).
- [ ] Broader accessibility review (contrast, landmarks, reduced motion preferences).
- [ ] Pagination or virtualized grid if the dataset grows beyond comfortable client rendering.

## Milestone 3 — Library features

- [ ] Edit and delete videos.
- [ ] Search and filter (by title, tag, date range).

## Milestone 4 — Media features

- [ ] Add support for attaching multiple video files to a single video record.
- [ ] Store attached files under a local `cloud-storage` folder (gitignored).
- [ ] Introduce a storage interface with async methods (`list`, `download`, `upload`) implemented against `cloud-storage`.
- [ ] Keep app code calling only the storage interface so a real cloud backend can replace local storage later without broad refactors.

## Milestone 5 — Personal creation workflow

- [ ] Reframe the app from "video library only" to a personal video creation + management tool.
- [ ] Add a `description` field to the video schema and UI so agent prompts have richer context.
- [ ] Add a new `pnpm` setup command for local coding-agent workflows (Cursor Agent CLI / Claude Code) with Hyperframes skill.
- [ ] Add a UI action to launch the selected coding agent with skill, title, and description.
- [ ] Design and implement a handoff flow to import generated video files back into storage and attach them to the originating video record.

## Explicit non-goals (for now)

These are intentionally deferred; they may move into milestones above as priorities change.

- Authentication and authorization.
- Pagination (unless performance requires it).
- Full-text search across the library.
- Edit/delete flows.
- Inline video playback in the app.
- Full accessibility pass and advanced keyboard UX for the tag chip input (tracked for Milestone 2).
