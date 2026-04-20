import { describe, expect, it } from "vitest";

import { fromDisplayId, toDisplayId, tryParseDisplayId } from "@/lib/ids";

describe("toDisplayId", () => {
  it("pads to at least 3 digits", () => {
    expect(toDisplayId(1)).toBe("v-001");
    expect(toDisplayId(50)).toBe("v-050");
    expect(toDisplayId(999)).toBe("v-999");
  });

  it("does not truncate beyond 999", () => {
    expect(toDisplayId(1000)).toBe("v-1000");
  });
});

describe("tryParseDisplayId", () => {
  it("returns null for invalid strings", () => {
    expect(tryParseDisplayId("bad")).toBeNull();
    expect(tryParseDisplayId("v-")).toBeNull();
  });

  it("matches fromDisplayId for valid ids", () => {
    expect(tryParseDisplayId("v-007")).toBe(7);
  });
});

describe("fromDisplayId", () => {
  it("parses padded ids", () => {
    expect(fromDisplayId("v-001")).toBe(1);
    expect(fromDisplayId("v-050")).toBe(50);
  });

  it("round-trips with toDisplayId for common ids", () => {
    for (const n of [1, 51, 999, 1000]) {
      expect(fromDisplayId(toDisplayId(n))).toBe(n);
    }
  });
});
