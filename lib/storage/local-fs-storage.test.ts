import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { LocalFsStorage } from "@/lib/storage/local-fs-storage";

describe("LocalFsStorage", () => {
  let dir: string;

  afterEach(() => {
    if (dir && fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("uploads, lists, downloads, and removes", async () => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "vs-"));
    const s = new LocalFsStorage(dir);
    const key = "videos/1/abc.txt";
    await s.upload(key, Buffer.from("hello"));
    const keys = await s.list("videos/1/");
    expect(keys.some((k) => k.endsWith("abc.txt"))).toBe(true);
    const buf = await s.download(key);
    expect(buf.toString()).toBe("hello");
    await s.remove(key);
    await expect(s.download(key)).rejects.toThrow();
  });
});
