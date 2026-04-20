import { describe, expect, it } from "vitest";

import { parseListQuery } from "@/lib/parse-list-query";

describe("parseListQuery", () => {
  it("parses sort and title filter", () => {
    const r = parseListQuery({ sort: "oldest", title: "  hello  " });
    expect(r.sort).toBe("oldest");
    expect(r.titleContains).toBe("hello");
  });

  it("maps from/to dates to UTC day bounds", () => {
    const r = parseListQuery({
      sort: "newest",
      from: "2024-06-01",
      to: "2024-06-30",
    });
    expect(r.createdFrom).toBe("2024-06-01T00:00:00.000Z");
    expect(r.createdTo).toBe("2024-06-30T23:59:59.999Z");
  });

  it("ignores malformed date strings", () => {
    const r = parseListQuery({ from: "not-a-date", to: "2024-01-02" });
    expect(r.createdFrom).toBeUndefined();
    expect(r.createdTo).toBe("2024-01-02T23:59:59.999Z");
  });
});
