import fs from "node:fs";
import path from "node:path";

import { LocalFsStorage } from "@/lib/storage/local-fs-storage";
import type { MediaStorage } from "@/lib/storage/storage";

const globalForStorage = globalThis as unknown as {
  mediaStorage?: MediaStorage;
};

function resolveRoot(): string {
  const raw = process.env.MEDIA_STORAGE_ROOT?.trim();
  const rel = raw && raw.length > 0 ? raw : "cloud-storage";
  return path.isAbsolute(rel)
    ? rel
    : path.join(process.cwd(), rel);
}

/**
 * Local object storage; swap implementation when moving to cloud (S3/R2/etc.).
 */
export function getMediaStorage(): MediaStorage {
  if (!globalForStorage.mediaStorage) {
    const root = resolveRoot();
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root, { recursive: true });
    }
    globalForStorage.mediaStorage = new LocalFsStorage(root);
  }
  return globalForStorage.mediaStorage;
}
