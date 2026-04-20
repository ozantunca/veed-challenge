"use client";

import { Check, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { VideoSort } from "@/lib/types/video";

const LABELS: Record<VideoSort, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
};

export function VideoSortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sort = useMemo((): VideoSort => {
    const raw = searchParams.get("sort");
    return raw === "oldest" ? "oldest" : "newest";
  }, [searchParams]);

  const setSort = useCallback(
    (next: VideoSort) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", next);
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[180px] justify-between">
          <span>Sort: {LABELS[sort]}</span>
          <ChevronDown className="size-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setSort("newest")}>
          <span className="flex-1">Newest first</span>
          {sort === "newest" ? <Check className="size-4" /> : null}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSort("oldest")}>
          <span className="flex-1">Oldest first</span>
          {sort === "oldest" ? <Check className="size-4" /> : null}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
