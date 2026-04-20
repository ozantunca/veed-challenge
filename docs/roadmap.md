# Roadmap

## Milestone 1 — MVP (current)

- Local SQLite database with seed data from `data/videos.json`.
- Video list in a responsive grid with title, created date, tags, and user-facing IDs.
- Sort by created date via a dropdown (newest / oldest) reflected in the URL.
- Create video form with required title and optional tags; defaults for other fields.
- API validation, structured errors, loading and error UI patterns.
- Unit tests for core utilities and repository behavior; end-to-end tests for primary flows.

## Milestone 2 — Quality & accessibility

- Full keyboard support for the tag chip input (focus order, aria labels, escape behavior).
- Broader accessibility review (contrast, landmarks, reduced motion preferences).
- Pagination or virtualized grid if the dataset grows beyond comfortable client rendering.

## Milestone 3 — Library features

- Edit and delete videos.
- Search and filter (by title, tag, date range).
- Optional authentication and multi-user libraries.

## Milestone 4 — Media features

- Upload or attach real media references (not just thumbnails).
- Inline playback or deep links to external players.
- Import/export (CSV/JSON) for library portability.

## Explicit non-goals (for now)

These are intentionally deferred; they may move into milestones above as priorities change.

- Authentication and authorization.
- Pagination (unless performance requires it).
- Full-text search across the library.
- Edit/delete flows.
- Video upload, transcoding, or hosting.
- Inline video playback in the app.
- Full accessibility pass and advanced keyboard UX for the tag chip input (tracked for Milestone 2).
