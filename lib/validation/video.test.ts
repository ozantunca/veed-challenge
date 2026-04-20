import { describe, expect, it } from "vitest";

import { createVideoBodySchema } from "@/lib/validation/video";

describe("createVideoBodySchema", () => {
  it("accepts title only and defaults tags", () => {
    const parsed = createVideoBodySchema.parse({ title: "Hello" });
    expect(parsed.title).toBe("Hello");
    expect(parsed.tags).toEqual([]);
  });

  it("trims title", () => {
    const parsed = createVideoBodySchema.parse({ title: "  spaced  " });
    expect(parsed.title).toBe("spaced");
  });

  it("rejects empty title", () => {
    expect(() => createVideoBodySchema.parse({ title: "" })).toThrow();
  });

  it("defaults missing description to empty string", () => {
    const parsed = createVideoBodySchema.parse({ title: "Hello" });
    expect(parsed.description).toBe("");
  });
});
