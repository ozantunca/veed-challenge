import { NextRequest } from "next/server";

import {
  jsonBadRequest,
  jsonOk,
  jsonServerError,
  zodErrorToFields,
} from "@/lib/api/response";
import { getVideoRepository } from "@/lib/repositories";
import { videoSortSchema } from "@/lib/validation/video";

export async function ListVideosRoute(req: NextRequest) {
  try {
    const sortParam = req.nextUrl.searchParams.get("sort") ?? "newest";
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

    const repo = getVideoRepository();
    const videos = await repo.list({ sort: parsedSort.data });
    return jsonOk({ videos });
  } catch (e) {
    console.error(e);
    return jsonServerError({
      error: { code: "INTERNAL", message: "Failed to list videos" },
    });
  }
}
