# App screenshots and README update
_Exported on 21/04/2026 at 18:42:44 GMT+3 from Cursor (3.1.15)_

---

**User**

/agent-browser-screenshots take screenshots of our app on veed.ozantunca.com and place them in our repo. also link them under Demo section of @README.md . 
i want you to take screenshots of the home page, filtered home page, new video page, edit video page, video view page

---

**Cursor**


Capturing screenshots with agent-browser and updating the README Demo section. Reading README and app routes to determine URLs.




Creating `docs/images` and capturing screenshots with agent-browser per the skill (viewport 1440×900).




Creating `docs/images` and capturing all screenshots in one agent-browser session.




Fetching a real video `displayId` from the live site — production doesn't use `v-001`.




Creating a video via the UI so we can capture edit and view pages — the library appears empty on production.




Re-capturing all five screenshots now that production has video `v-001`.




Updating the README Demo section with image links.




Here is what was done:

### Screenshots
All five PNGs are under `docs/images/` (1440×900):

| File | Page |
|------|------|
| `demo-home.png` | Home / video library |
| `demo-home-filtered.png` | Home with **Title contains** filter (`?title=Demo`) |
| `demo-new-video.png` | `/new` |
| `demo-edit-video.png` | `/videos/v-001/edit` |
| `demo-video-view.png` | `/videos/v-001` |

### Production note
The live site had **no videos**, so `/videos/v-001/edit` and `/videos/v-001` first returned 404. A single video was created through **New video** so those routes exist; it became **`v-001`**, and all screenshots were taken after that.

### README
The **Demo** section now includes a short table with markdown image links to each file.

If you want the filtered shot to use another query (for example `?tag=tutorial` once you have seeded data), say what URL you prefer and we can swap the asset and caption.

