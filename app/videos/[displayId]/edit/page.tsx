import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";

import { VideoEditPage } from "@/components/VideoEditPage";
import { tryParseDisplayId } from "@/lib/ids";
import { getVideoRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

export default async function VideoEditRoutePage({
  params,
}: {
  params: Promise<{ displayId: string }>;
}) {
  noStore();
  const { displayId } = await params;
  const id = tryParseDisplayId(displayId);
  if (id === null) notFound();
  const repo = getVideoRepository();
  const video = await repo.getById(id);
  if (!video) notFound();
  return <VideoEditPage video={video} />;
}
