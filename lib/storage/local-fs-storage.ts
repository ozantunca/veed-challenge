import fs from "node:fs/promises";
import path from "node:path";

import type { MediaStorage } from "@/lib/storage/storage";

function assertSafeKey(key: string): void {
  if (key.includes("\0") || key.includes("..") || path.isAbsolute(key)) {
    throw new Error("Invalid storage key");
  }
}

/**
 * Stores files under a root directory (e.g. `./cloud-storage`).
 */
export class LocalFsStorage implements MediaStorage {
  constructor(private readonly rootAbs: string) {}

  private resolve(key: string): string {
    assertSafeKey(key);
    const full = path.resolve(this.rootAbs, ...key.split("/").filter(Boolean));
    if (
      full !== this.rootAbs &&
      !full.startsWith(this.rootAbs + path.sep)
    ) {
      throw new Error("Invalid storage key path");
    }
    return full;
  }

  async upload(key: string, data: Buffer): Promise<void> {
    const full = this.resolve(key);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, new Uint8Array(data));
  }

  async download(key: string): Promise<Buffer> {
    const full = this.resolve(key);
    return fs.readFile(full);
  }

  async list(prefix: string): Promise<string[]> {
    const normalized = prefix.replace(/^\/+|\/+$/g, "");
    const dir = path.join(this.rootAbs, ...normalized.split("/").filter(Boolean));
    try {
      const names = await fs.readdir(dir);
      const base =
        normalized === "" ? "" : normalized + "/";
      return names.map((n) => `${base}${n}`);
    } catch (e) {
      const err = e as NodeJS.ErrnoException;
      if (err.code === "ENOENT") return [];
      throw e;
    }
  }

  async remove(key: string): Promise<void> {
    const full = this.resolve(key);
    try {
      await fs.unlink(full);
    } catch (e) {
      const err = e as NodeJS.ErrnoException;
      if (err.code === "ENOENT") return;
      throw e;
    }
  }
}
