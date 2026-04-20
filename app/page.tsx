import { unstable_noStore as noStore } from "next/cache";

import { VideoListPage } from "@/components/VideoListPage";
import { getVideoRepository } from "@/lib/repositories";
import { parseSort } from "@/lib/parse-sort";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  noStore();
  const sp = await searchParams;
  const sort = parseSort(sp.sort);
  const repo = getVideoRepository();
  const videos = await repo.list({ sort });
  return <VideoListPage videos={videos} />;
}
