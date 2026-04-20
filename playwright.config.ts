import path from "node:path";

import { defineConfig, devices } from "@playwright/test";

const E2E_PORT = "3333";
const E2E_ORIGIN = `http://127.0.0.1:${E2E_PORT}`;
const E2E_DB_FILE = path.resolve(process.cwd(), "data", "e2e-videos.db");
const E2E_STORAGE_DIR = path.resolve(process.cwd(), "data", "e2e-cloud-storage");

export default defineConfig({
  globalSetup: "./e2e/global-setup.ts",
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: E2E_ORIGIN,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm seed && pnpm exec next dev --turbopack -p ${E2E_PORT}`,
    url: E2E_ORIGIN,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ...process.env,
      VIDEO_DB_PATH: E2E_DB_FILE,
      MEDIA_STORAGE_ROOT: E2E_STORAGE_DIR,
    },
  },
});
