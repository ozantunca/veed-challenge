import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";

import { migrate } from "@/lib/db/migrate";
import { seedVideosFromJson } from "@/lib/db/seed-videos";
import { SqliteVideoRepository } from "@/lib/repositories/sqlite-video-repository";

describe("SqliteVideoRepository", () => {
  it("seeds, lists, and creates with incrementing display ids", async () => {
    const db = new Database(":memory:");
    migrate(db);
    seedVideosFromJson(db);
    const repo = new SqliteVideoRepository(db);

    const newest = await repo.list({ sort: "newest" });
    expect(newest.length).toBe(50);
    expect(newest[0]?.displayId).toBeDefined();

    const oldest = await repo.list({ sort: "oldest" });
    expect(oldest[0]?.created_at <= oldest[1]?.created_at).toBe(true);

    const created = await repo.create({
      title: "E2E unit video",
      tags: ["alpha", "beta"],
    });
    expect(created.displayId).toBe("v-051");
    expect(created.tags).toEqual(["alpha", "beta"]);
    expect(created.thumbnail_url).toContain("v-051");

    const after = await repo.list({ sort: "newest" });
    expect(after[0]?.title).toBe("E2E unit video");
  });
});
