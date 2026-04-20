import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { VideoSortDropdown } from "@/components/VideoSortDropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatVideoDate } from "@/lib/format-date";
import type { Video } from "@/lib/types/video";

export function VideoListPage({ videos }: { videos: Video[] }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Video library</h1>
          <p className="text-sm text-muted-foreground">
            Browse seeded videos and items you create locally.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Suspense
            fallback={<Skeleton className="h-10 min-w-[180px] rounded-md" />}
          >
            <VideoSortDropdown />
          </Suspense>
          <Button asChild>
            <Link href="/new">New video</Link>
          </Button>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <div className="text-lg font-medium">No videos yet</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first video to populate this library.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/new">Create a video</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <Card
              key={v.id}
              data-testid="video-card"
              data-display-id={v.displayId}
              className="overflow-hidden pt-0"
            >
              <div className="relative aspect-video w-full bg-muted">
                <Image
                  src={v.thumbnail_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <CardHeader className="gap-2">
                <CardTitle
                  className="line-clamp-2 text-base"
                  data-testid="video-title"
                >
                  {v.title}
                </CardTitle>
                <CardDescription>
                  <span data-testid="video-created-at">
                    {formatVideoDate(v.created_at)}
                  </span>
                  <span className="text-muted-foreground"> · </span>
                  <span className="font-mono text-xs" data-testid="video-id">
                    {v.displayId}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {v.tags.length === 0 ? (
                  <span className="text-sm text-muted-foreground">No tags</span>
                ) : (
                  v.tags.map((t, idx) => (
                    <Badge
                      key={`${v.id}-tag-${idx}`}
                      variant="secondary"
                      data-testid="video-tag"
                    >
                      {t}
                    </Badge>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
