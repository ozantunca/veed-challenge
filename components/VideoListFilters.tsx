"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function VideoListFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function apply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams(searchParams.toString());
    const textFields = ["title", "tag", "from", "to"] as const;
    for (const name of textFields) {
      const v = fd.get(name)?.toString().trim() ?? "";
      if (v) params.set(name, v);
      else params.delete(name);
    }
    router.push(`/?${params.toString()}`);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    for (const k of ["title", "tag", "from", "to"]) {
      params.delete(k);
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <form
      key={searchParams.toString()}
      onSubmit={apply}
      className="mb-8 rounded-xl border bg-card/40 p-4 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="filter-title">Title contains</Label>
          <Input
            id="filter-title"
            name="title"
            placeholder="Search title"
            defaultValue={searchParams.get("title") ?? ""}
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="filter-tag">Tag</Label>
          <Input
            id="filter-tag"
            name="tag"
            placeholder="Exact tag match"
            defaultValue={searchParams.get("tag") ?? ""}
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="filter-from">Created from</Label>
          <Input
            id="filter-from"
            name="from"
            type="date"
            defaultValue={searchParams.get("from") ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="filter-to">Created to</Label>
          <Input
            id="filter-to"
            name="to"
            type="date"
            defaultValue={searchParams.get("to") ?? ""}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="submit">Apply filters</Button>
        <Button type="button" variant="outline" onClick={clearFilters}>
          Clear filters
        </Button>
      </div>
    </form>
  );
}
