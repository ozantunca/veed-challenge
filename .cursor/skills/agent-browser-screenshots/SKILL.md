---
name: agent-browser-screenshots
description: Captures UI screenshots with the agent-browser CLI at a laptop-sized viewport, including navigation, waits, and full-page shots. Use when updating Notion help desk pages, in-repo docs or articles, changelogs, or when the user asks for browser screenshots, product captures, or visual documentation of the app.
---

# agent-browser screenshots

Use **[agent-browser](https://agent-browser.dev/)** (`agent-browser` on PATH, or `npx agent-browser` if installed as a dev dependency) to open a URL or flow, stabilize the page, and save a PNG (or JPEG) for Notion, Markdown docs, or PRs.

## Defaults

- **Viewport (laptop):** `1440` × `900` device pixels — set **before** `open` so the first paint uses this size.
- **Output:** explicit path under the repo (e.g. `docs/images/...png`) or a folder the user names; avoid only the default temp path when the asset must be committed or uploaded.
- **Format:** PNG unless file size matters; then `screenshot --screenshot-format jpeg --screenshot-quality 85`.

## Standard capture flow

Run in the shell from the machine that can reach the URL (local dev, preview deploy, or production).

1. **Viewport** (once per session or before each `open`):

   ```bash
   agent-browser set viewport 1440 900
   ```

2. **Navigate:**

   ```bash
   agent-browser open "https://example.com/path"
   ```

   Use `http://localhost:3000/...` for local Next.js when the dev server is running.

3. **Stabilize** (pick what matches the UI):

   ```bash
   agent-browser wait --load networkidle
   ```

   Or wait for a selector / text:

   ```bash
   agent-browser wait "#editor-root"
   agent-browser wait --text "Saved"
   ```

4. **Screenshot:**

   ```bash
   agent-browser screenshot path/to/output.png
   ```

   Full scrolling page:

   ```bash
   agent-browser screenshot --full path/to/output-full.png
   ```

5. **Optional — discover refs for interactions:** `agent-browser snapshot -i`, then `click` / `fill` / `find ...` using `@eN` refs from the snapshot. Chain with `&&` when intermediate output is not needed.

6. **Cleanup** when finished:

   ```bash
   agent-browser close
   ```

### One-shot chain (common)

```bash
agent-browser set viewport 1440 900 && \
  agent-browser open "http://localhost:3000/editor" && \
  agent-browser wait --load networkidle && \
  agent-browser screenshot docs/images/editor-laptop.png && \
  agent-browser close
```

## Viewport overrides

| Target | Command |
|--------|---------|
| Smaller laptop | `agent-browser set viewport 1366 768` |
| “720p” laptop | `agent-browser set viewport 1280 720` |
| Retina-style sharper PNG (larger files) | `agent-browser set viewport 1440 900 2` |

Use `agent-browser set device "iPhone 14"` only when the task explicitly needs mobile, not the default.

## Auth and local files

- **Logged-in flows:** `agent-browser state load <path>`, `agent-browser auth login <name>`, or `--profile` — prefer patterns that avoid putting secrets in shell history; see upstream [commands](https://agent-browser.dev/commands) for `auth` / `state`.
- **Local HTML/PDF:** `agent-browser --allow-file-access open file:///absolute/path/to/file.html`

## After capture

- **Notion (MCP):** If [Notion MCP](https://www.notion.com/help/notion-mcp) is enabled (often in **user-level** `~/.cursor/mcp.json`, merged with the repo’s `.cursor/mcp.json`), Cursor exposes it as the **`user-notion`** server. Use `notion-fetch` / `notion-update-page` / `notion-search` there. `![caption](URL)` in `replace_content` needs a **publicly reachable** image URL so Notion can import the file; local paths are not enough—upload in the Notion UI, or ship assets under a public origin (e.g. your site’s `/public` after deploy) and reference that URL.
- **Notion (manual):** Drag images into the page or use an image block next to the steps.
- **Repo docs:** Reference the saved path in Markdown (`![Alt](images/foo.png)`). Keep filenames stable or versioned if replacing breaks old links.

## Troubleshooting

- Flaky load: add `wait` for a concrete selector or `--text` instead of only `networkidle`.
- Wrong theme: `agent-browser --color-scheme dark open ...` (global) or `agent-browser set media dark` per docs.
- CI / headless: ensure Playwright/Chromium deps for agent-browser are installed per its install docs on the runner.

## Additional resources

- Command reference: [agent-browser.dev/commands](https://agent-browser.dev/commands)
