import { describe, expect, it } from "vitest";

import {
  NEW_VIDEO_NUMERIC_DEFAULTS,
  newVideoThumbnailUrl,
} from "@/lib/new-video-defaults";

describe("NEW_VIDEO_NUMERIC_DEFAULTS", () => {
  it("matches product defaults for duration and views", () => {
    expect(NEW_VIDEO_NUMERIC_DEFAULTS.duration).toBe(0);
    expect(NEW_VIDEO_NUMERIC_DEFAULTS.views).toBe(0);
  });
});

describe("newVideoThumbnailUrl", () => {
  it("builds picsum URL with encoded display id in the seed path", () => {
    expect(newVideoThumbnailUrl("v-051")).toBe(
      "https://picsum.photos/seed/v-051/300/200",
    );
  });

  it("encodes special characters in the seed segment", () => {
    expect(newVideoThumbnailUrl("v-100&")).toContain("v-100%26");
  });
});
