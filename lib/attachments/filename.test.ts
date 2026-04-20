import { describe, expect, it } from "vitest";

import {
  makeAttachmentStorageKey,
  safeFileSegment,
} from "@/lib/attachments/filename";

describe("safeFileSegment", () => {
  it("strips directories and unsafe characters", () => {
    expect(safeFileSegment("../../evil/clip.mp4")).toBe("clip.mp4");
    expect(safeFileSegment("My Clip!.mp4")).toBe("My_Clip_.mp4");
  });
});

describe("makeAttachmentStorageKey", () => {
  it("prefixes with videos/{id}/ and uuid", () => {
    const k = makeAttachmentStorageKey(3, "clip.mp4");
    expect(k.startsWith("videos/3/")).toBe(true);
    expect(k).toMatch(/videos\/3\/[0-9a-f-]{36}_clip\.mp4/);
  });
});
