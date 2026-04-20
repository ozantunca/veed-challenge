import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import {
  jsonBadRequest,
  jsonNotFound,
  jsonOk,
  jsonServerError,
  zodErrorToFields,
} from "@/lib/api/response";
import { getVideoRepository } from "@/lib/repositories";
import {
  updateVideoBodySchema,
  videoIdParamSchema,
} from "@/lib/validation/video";

export async function UpdateVideoRoute(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: raw } = await context.params;
    const parsedId = videoIdParamSchema.safeParse(raw);
    if (!parsedId.success) {
      return jsonBadRequest({
        error: {
          code: "INVALID_ID",
          message: "Invalid video id",
          fields: zodErrorToFields(parsedId.error),
        },
      });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return jsonBadRequest({
        error: { code: "INVALID_JSON", message: "Request body must be JSON" },
      });
    }

    const parsed = updateVideoBodySchema.safeParse(body);
    if (!parsed.success) {
      return jsonBadRequest({
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          fields: zodErrorToFields(parsed.error),
        },
      });
    }

    const repo = getVideoRepository();
    const existing = await repo.getById(parsedId.data);
    if (!existing) {
      return jsonNotFound({
        error: { code: "NOT_FOUND", message: "Video not found" },
      });
    }

    const video = await repo.update(parsedId.data, {
      title: parsed.data.title,
      description: parsed.data.description,
      tags: parsed.data.tags ?? [],
    });

    if (!video) {
      return jsonNotFound({
        error: { code: "NOT_FOUND", message: "Video not found" },
      });
    }

    revalidatePath("/");
    revalidatePath(`/videos/${video.displayId}`);
    revalidatePath(`/videos/${video.displayId}/edit`);

    return jsonOk({ video });
  } catch (e) {
    console.error(e);
    return jsonServerError({
      error: { code: "INTERNAL", message: "Failed to update video" },
    });
  }
}
