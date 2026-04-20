# development method

This is the initial prompt document to start a project. Below you will find the project details you need to craft a plan and create the initial version of the project.

We need to craft a plan for this project and document it in "docs" folder. `index.md` file of the folder must include links to other documents and must explain the project in detail without getting into code examples. it must explain high level architecture, design decisions and product vision. We will need another document which will include our roadmap and the features we have in mind along with the direction we want to proceed. As the project continues, we must update our vision, business model, user experience and other details so anyone can easily get up to speed by reading these docs.

Use pnpm, typescript, react, tailwind, shadcn, zustand, node.js and anything else we might need, we'll discuss together.

Before we start, we also need to update the color scheme in `.vscode/settings.json`. just update the titleBar color scheme to something I choose (recommend options).

# project details

Build a full-stack application that allows users to browse and manage their video library.

- Have a page that lists videos
  - The videos should be laid out in a grid
  - For each video, display its `title`, `created_at` date, and `tags`
  - Allow sorting based on `created_at` date
- Have a page that allows creating a new video
  - It should require you to set `title`.
  - For `tags`, allow optionally adding one or more tags.
  - For `thumbnail_url`, `created_at`, `duration`, and `views`, you can use default/placeholder values.
- Use the provided `videos.json` to seed your dataset.
- The project can be run entirely locally, and the setup process is quick and easy.

We need to also pay attention to:

- testing (cover utility functions with unit tests and have a couple of e2e tests for main user flows)
- API and input validation
- error handling
- loading and error states on UI
