# Product & UX

## Principles

- **Clarity first**: every screen communicates what it is for and what happens next.
- **Fail loudly, recover easily**: validation and server errors use plain language; users can retry without losing context.
- **Local-first trust**: data stays on disk in SQLite; no surprise network dependencies for core flows.

## Primary flows

### Browse the library

1. User opens the home page and sees a grid of videos.
2. User changes sort order via the **Sort** dropdown; the URL updates and the list reorders by `created_at`.
3. Empty state explains that no videos exist and offers a path to create one.

### Create a video

1. User opens **New video**, enters a **title**, and optionally adds **tags** using chips.
2. On success, the app returns to the library sorted by **newest first** so the new item is easy to spot.
3. On failure, inline field errors and/or a banner explain what went wrong.

## Loading states

- Route-level loading uses a skeleton grid on the home page while server data resolves.
- The create form disables submission while the request is in flight and shows a **Creating…** label on the primary button.

## Error states

- **Global**: unexpected errors surface a dedicated error view with a **Try again** action.
- **Forms**: field-level messages map to inputs; non-field failures use a destructive inline alert.
- **API consumers**: errors return a consistent JSON shape with `code`, `message`, and optional `fields`.

## Toasts

Short-lived toasts confirm successful creation without blocking navigation.

## Copy guidelines

- Prefer short sentences; avoid jargon like “persisted” or “mutation” in user-visible text.
- Dates are formatted with the user’s locale when possible.
