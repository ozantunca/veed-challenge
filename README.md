# Veed Challenge

My implementation process for the challenge. This README is written by me.

## Tech stack

## Setup instructions

## Future improvements

## AI usage

I use AI heavily day to day. In fact, my template project does no include any library but only - `.cursor` folder with rules and skills

- `docs` folder with [Starting prompt](./docs/starting-prompt.md) that defines my go-to tech and where I put the project brief
- `.vscode` config to set a custom color for the title bar Cursor because that's how I visually signal to myself which project I'm looking at
- `.prettierrc`

Everything else is set up by running starting-prompt.md during the initial AI conversation. I refrain from installing specific libraries into my template project because all libraries get updated over time and not every project needs every library. It's easier to let AI know how I prefer my projects to be set up and let it do the rest.

I started by adding `videos.json` to a `data` folder and placing a project brief into `starting-prompt.md` (see initial commit).

I exported all AI conversations under [conversations](/ai-conversations/) folder.
