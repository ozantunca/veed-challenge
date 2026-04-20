import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import Database from "better-sqlite3";
import { afterEach, describe, expect, it } from "vitest";

import { migrate } from "@/lib/db/migrate";
import { seedVideosFromJson } from "@/lib/db/seed-videos";
import { SqliteAttachmentRepository } from "@/lib/repositories/sqlite-attachment-repository";
import { LocalFsStorage } from "@/lib/storage/local-fs-storage";

describe("SqliteAttachmentRepository", () => {
  let tmpDir: string;

  afterEach(() => {
    if (tmpDir && fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it("creates and lists attachments for a video", async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vatt-"));
    const storage = new LocalFsStorage(tmpDir);

    const db = new Database(":memory:");
    db.pragma("foreign_keys = ON");
    migrate(db);
    seedVideosFromJson(db);
    const repo = new SqliteAttachmentRepository(db);
    expect((await repo.listByVideoId(1)).length).toBe(0);

    const key = "videos/1/test-attach.bin";
    await storage.upload(key, Buffer.from("x"));

    const row = await repo.create({
      videoId: 1,
      storageKey: key,
      filename: "test-attach.bin",
      contentType: "application/octet-stream",
      byteSize: 1,
    });
    expect(row.videoId).toBe(1);

    const list = await repo.listByVideoId(1);
    expect(list.length).toBe(1);
    expect(list[0]?.filename).toBe("test-attach.bin");

    await storage.remove(key);
    db.close();
  });
});
