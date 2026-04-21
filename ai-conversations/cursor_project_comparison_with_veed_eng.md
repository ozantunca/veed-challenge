# Project comparison with VEED engineering challenge
_Exported on 21/04/2026 at 14:43:16 GMT+3 from Cursor (3.1.15)_

---

**User**

compare the task brief below with our project and comment on it:

# VEED Full-Stack Engineering Challenge: Video Library Dashboard

**Time Expectation:** Approximately 4 hours

### Challenge Overview

Build a full-stack application that allows users to browse and manage their video library.

Feel free to take any shortcuts you'd like when setting up the project, such as using a template project, libraries, etc.

### AI Tools

You are welcome and encouraged to use AI tools (e.g. ChatGPT, Claude, GitHub Copilot, Cursor, etc.) during this challenge. However, you must:

- Submit your AI conversation logs or prompts alongside your code (e.g. exported chat, shared link, or a saved file).
- Include a dedicated **AI Usage** section in your README (see README requirements below).

### Requirements

- Have a page that lists videos
    - The videos should be laid out in a grid
    - For each video, display its `title`, `created_at` date, and `tags`
    - Allow sorting based on `created_at` date
- Have a page that allows creating a new video
    - It should require you to set `title`.
    - For `tags`, allow optionally adding one or more tags.
    - For `thumbnail_url`, `created_at`, `duration`, and `views`, you can use default/placeholder values.
- Technologies we’d like you to use: Typescript, React, Node.JS.
Feel free to use anything else you’d like within reason.
- Use the provided `videos.json` to seed your dataset.
- The project can be run entirely locally, and the setup process is quick and easy.
- Provide a README describing
    - Tech stack
    - Setup instructions
    - Future improvements
    - **AI Usage** — which tools you used, how you used them, and your reflections on the experience

### Non-functional aspects that we’ll evaluate

In no specific order:

- Code quality (structure, readability, consistency, reliability, typing)
- Project structure
- Testing (no need to test all of your code, a few examples are fine)
- API and input validation
- Error handling
- Loading states
- Quality of UI and UX
- README: describe
    - Tech stack
    - Setup instructions
    - Future improvements (not necessarily in terms of more functionality, but more in terms of what you'd polish or implement differently if you had more time)
    - **AI Usage**: which AI tools you used, how you used them (e.g. code generation, debugging, architecture decisions), and any reflections on the experience

### Provided Resources

`videos.json` - Contains array of 50+ video objects with fields: `id`, `title`, `thumbnail_url`, `created_at`, `duration` (in seconds), `views`, `tags` 

[videos.json](attachment:d56b1c8b-2528-4e2d-b8c3-0f1c165ee0af:videos.json)

### Submission Guidelines

Submit GitHub repository link containing both frontend and backend code. Include setup instructions in README.

If you used AI tools, also include your conversation logs or prompts. You can do this by:

- Sharing a link to the conversation (e.g. a shared ChatGPT or Claude link)
- Exporting and committing the conversation to your repository (e.g. as a `ai-conversations/` folder or a `PROMPTS.md` file)

We are not evaluating whether you used AI — we're interested in **how** you used it and your reflections on the process.

---

**Cursor**

I’ll quickly audit the current project against each challenge requirement, starting with the README and core video list/create flows, then I’ll give you a gap-by-gap assessment with concrete comments.

I’ve loaded the README and config; next I’m checking the actual implementation (pages, API, seed, and tests) to confirm what’s truly covered versus what’s just documented.

I’ve confirmed list/create UI and sorting are implemented; now I’m validating seeding from `videos.json`, local-run expectations, and test coverage to spot any mismatch with the brief.

Your project is **well aligned** with the brief and in several areas goes beyond it.

## Brief vs Project

- **Video listing page (grid + title/created_at/tags + sorting):** ✅ Implemented in `app/page.tsx` + `components/VideoListPage.tsx`, with sorting UI in `components/VideoSortDropdown.tsx` and repository sorting by `created_at` in `lib/repositories/sqlite-video-repository.ts`.
- **Create video page (required title, optional tags, defaults):** ✅ Implemented in `app/new/page.tsx` + `components/VideoCreatePage.tsx`, with title validation and optional tags via Zod in `lib/validation/video.ts`; default values handled in repository/defaults (`lib/new-video-defaults.ts`).
- **Tech stack (TypeScript, React, Node.js):** ✅ Met (`Next.js` app with TS and API routes).
- **Seed from provided `videos.json`:** ✅ Implemented in `scripts/seed.ts` and `lib/db/seed-videos.ts` using `data/videos.json`.
- **Runs locally with quick setup:** ✅ Mostly met, though your README currently emphasizes production flow (`build` + `start`) rather than fastest dev flow.
- **README required sections (tech stack, setup, future improvements, AI usage):** ✅ Present in `README.md`.
- **AI conversation logs/prompts submitted:** ✅ You have `ai-conversations/` plus AI Usage notes in README.

## Non-functional evaluation fit

- **Code quality / structure / typing:** Strong; clear separation between UI, API routes, validation, and repositories.
- **Testing:** Strong for a challenge scope (unit/component/e2e present, including list/sort/create behavior).
- **API validation & error handling:** Good (Zod validation + structured API errors).
- **Loading states:** Present (`app/loading.tsx` skeleton) and error UI (`app/error.tsx`).
- **UI/UX quality:** Above baseline for challenge requirements.

## Comments / potential reviewer concerns

- **Scope creep:** You added attachments/edit/delete features beyond brief. This is positive technically, but some reviewers may prefer focus over breadth in a timed challenge.
- **README setup clarity:** “quick and easy local setup” could be clearer with a `pnpm dev` first-path; current instructions are workable but heavier than needed.
- **AI logs strictness:** You have conversation files, but if reviewers expect *raw/full* transcripts, consider confirming they’re complete enough (not just summaries).
- **Minor README polish:** A few wording/typo issues could be cleaned to look more submission-ready.

If you want, I can do a short “submission hardening” pass on the README so it reads exactly like a challenge handoff (without touching code).

