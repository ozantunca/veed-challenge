import { NextRequest } from "next/server";

import {
  jsonBadRequest,
  jsonOk,
  jsonServerError,
  zodErrorToFields,
} from "@/lib/api/response";
import { parseListQuery } from "@/lib/parse-list-query";
import { getVideoRepository } from "@/lib/repositories";
import { videoSortSchema } from "@/lib/validation/video";

export async function ListVideosRoute(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const sortParam = sp.get("sort") ?? "newest";
    const parsedSort = videoSortSchema.safeParse(sortParam);
    if (!parsedSort.success) {
      return jsonBadRequest({
        error: {
          code: "INVALID_SORT",
          message: "Invalid sort parameter",
          fields: zodErrorToFields(parsedSort.error),
        },
      });
    }

    const listOptions = parseListQuery({
      sort: sortParam,
      title: sp.get("title") ?? undefined,
      tag: sp.get("tag") ?? undefined,
      from: sp.get("from") ?? undefined,
      to: sp.get("to") ?? undefined,
    });

    const repo = getVideoRepository();
    const videos = await repo.list(listOptions);
    return jsonOk({ videos });
  } catch (e) {
    console.error(e);
    return jsonServerError({
      error: { code: "INTERNAL", message: "Failed to list videos" },
    });
  }
}
