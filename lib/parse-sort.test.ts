import { describe, expect, it } from "vitest";

import { parseSort } from "@/lib/parse-sort";

describe("parseSort", () => {
  it("defaults to newest when undefined or empty", () => {
    expect(parseSort(undefined)).toBe("newest");
    expect(parseSort("")).toBe("newest");
  });

  it("accepts newest and oldest", () => {
    expect(parseSort("newest")).toBe("newest");
    expect(parseSort("oldest")).toBe("oldest");
  });

  it("falls back to newest for invalid values", () => {
    expect(parseSort("invalid")).toBe("newest");
  });
});
