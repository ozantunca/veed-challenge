import fs from "node:fs";
import path from "node:path";

const E2E_DB_FILE = path.resolve(process.cwd(), "data", "e2e-videos.db");

/**
 * Remove any previous e2e DB so `pnpm seed` in the Playwright webServer command
 * always starts from a clean file before Next boots.
 */
export default async function globalSetup() {
  for (const p of [E2E_DB_FILE, `${E2E_DB_FILE}-wal`, `${E2E_DB_FILE}-shm`]) {
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
    }
  }
}
