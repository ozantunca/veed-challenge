import { unstable_noStore as noStore } from "next/cache";

import { VideoListPage } from "@/components/VideoListPage";
import { parseListQuery, firstSearchParam } from "@/lib/parse-list-query";
import { getVideoRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    sort?: string;
    title?: string;
    tag?: string;
    from?: string;
    to?: string;
  }>;
}) {
  noStore();
  const sp = await searchParams;
  const listOptions = parseListQuery({
    sort: firstSearchParam(sp.sort),
    title: firstSearchParam(sp.title),
    tag: firstSearchParam(sp.tag),
    from: firstSearchParam(sp.from),
    to: firstSearchParam(sp.to),
  });
  const repo = getVideoRepository();
  const videos = await repo.list(listOptions);
  return <VideoListPage videos={videos} />;
}
