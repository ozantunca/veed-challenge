import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatVideoDate } from "@/lib/format-date";
import type { Video } from "@/lib/types/video";

export function VideoDetailPage({ video }: { video: Video }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/"
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Back to library
      </Link>

      <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl border bg-muted">
        <Image
          src={video.thumbnail_url}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 42rem"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{video.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-mono text-xs">{video.displayId}</span>
            <span> · </span>
            <span>{formatVideoDate(video.created_at)}</span>
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/videos/${video.displayId}/edit`}>Edit</Link>
        </Button>
      </div>

      <div
        className="mt-8 rounded-xl border bg-card p-6 text-card-foreground shadow-sm"
        data-testid="video-description"
      >
        {video.description.trim() ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {video.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">No description.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-muted-foreground">Tags</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {video.tags.length === 0 ? (
            <span className="text-sm text-muted-foreground">No tags</span>
          ) : (
            video.tags.map((t, idx) => (
              <Badge key={`${video.id}-tag-${idx}`} variant="secondary">
                {t}
              </Badge>
            ))
          )}
        </div>
      </div>

      <div className="mt-10 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        Attachments and media files will appear here in a future update.
      </div>
    </div>
  );
}
