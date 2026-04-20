import fs from "node:fs";
import path from "node:path";

const E2E_DB_FILE = path.resolve(process.cwd(), "data", "e2e-videos.db");
const E2E_STORAGE_DIR = path.resolve(process.cwd(), "data", "e2e-cloud-storage");

/**
 * Remove any previous e2e DB / storage so `pnpm seed` in the Playwright webServer command
 * always starts from a clean file before Next boots.
 */
export default async function globalSetup() {
  for (const p of [E2E_DB_FILE, `${E2E_DB_FILE}-wal`, `${E2E_DB_FILE}-shm`]) {
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
    }
  }
  if (fs.existsSync(E2E_STORAGE_DIR)) {
    fs.rmSync(E2E_STORAGE_DIR, { recursive: true, force: true });
  }
}
