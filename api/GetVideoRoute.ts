import { NextRequest } from "next/server";

import {
  jsonBadRequest,
  jsonNotFound,
  jsonOk,
  jsonServerError,
  zodErrorToFields,
} from "@/lib/api/response";
import { getVideoRepository } from "@/lib/repositories";
import { videoIdParamSchema } from "@/lib/validation/video";

export async function GetVideoRoute(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: raw } = await context.params;
    const parsed = videoIdParamSchema.safeParse(raw);
    if (!parsed.success) {
      return jsonBadRequest({
        error: {
          code: "INVALID_ID",
          message: "Invalid video id",
          fields: zodErrorToFields(parsed.error),
        },
      });
    }

    const repo = getVideoRepository();
    const video = await repo.getById(parsed.data);
    if (!video) {
      return jsonNotFound({
        error: { code: "NOT_FOUND", message: "Video not found" },
      });
    }

    return jsonOk({ video });
  } catch (e) {
    console.error(e);
    return jsonServerError({
      error: { code: "INTERNAL", message: "Failed to load video" },
    });
  }
}
