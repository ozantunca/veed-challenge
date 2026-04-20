# Veed Challenge

My implementation process for the challenge. This README is written by me.

## Tech stack

- Next.js
- TypeScript
- Node.js - through Next.js API Routes
- SQLite - easy to setup, to backup, and to port data for an MVP. I would use something else if scale was a near-term concern
- Shadcn and Tailwind for UI
- Zod for schema validation

## Setup instructions

This project uses `pnpm` so commands below will run a production build.

```sh
pnpm i
pnpm build
pnpm seed # first run only
pnpm start
```

## Future improvements

## AI usage

I use AI heavily day to day. In fact, my template project does no include any library but only - `.cursor` folder with rules and skills

- `docs` folder with [Starting prompt](./docs/starting-prompt.md) that defines my go-to tech and where I put the project brief
- `.vscode` config to set a custom color for the title bar Cursor because that's how I visually signal to myself which project I'm looking at
- `.prettierrc`

Everything else is set up by running starting-prompt.md during the initial AI conversation. I refrain from installing specific libraries into my template project because all libraries get updated over time and not every project needs every library. It's easier to let AI know how I prefer my projects to be set up and let it do the rest.

I started by adding `videos.json` to a `data` folder and placing a project brief into `starting-prompt.md` (see initial commit).

I exported all AI conversations under [conversations](/ai-conversations/) folder.

### Workflow

I use both Cursor and Claude for coding. Claude code is useful because it comes with more generous usage than Claude's API pricing. Claude is also useful for planning features or doing more creative work. Cursor is my actual workhorse. In my experience, it tends to be a lot faster in running tools, understanding context and executing. I usually use Codex and Composer in it.

I often start in Ask mode to learn/remember specific parts of the codebase and explore how a certain feature can be implemented. Then I switch to Plan mode to clarify an action plan, get that plan reviewed by different models, execute the plan, and review the code. Of course things don't always go according to plan. AI can create redundant code when it cannot find a library, use a different approach than intended, or create UI/UX that is simply not good.

Usually I work on multiple tabs at the same time. One of them for active coding, others for investigations (debugging, understanding codebase) and planning (new features, initiatives, bug fixes).

When there are plans, I save them in the codebase and keep them for a while even if they're fully implemented. This is useful for:

- getting plans reviewed if they're not going to be implemented immediately
- debugging if a bug arises from a recent implementation
- planning follow ups.

I remove those plans after they stop being relevant. You can view them under `.cursor/plans`.
