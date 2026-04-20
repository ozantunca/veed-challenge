import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import {
  jsonBadRequest,
  jsonNoContent,
  jsonNotFound,
  jsonServerError,
  zodErrorToFields,
} from "@/lib/api/response";
import { getAttachmentRepository, getVideoRepository } from "@/lib/repositories";
import { getMediaStorage } from "@/lib/storage";
import { videoIdParamSchema } from "@/lib/validation/video";

export async function DeleteVideoRoute(
  _req: NextRequest,
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

    const repo = getVideoRepository();
    const existing = await repo.getById(parsedId.data);
    if (!existing) {
      return jsonNotFound({
        error: { code: "NOT_FOUND", message: "Video not found" },
      });
    }

    const displayId = existing.displayId;
    const attRepo = getAttachmentRepository();
    const attachments = await attRepo.listByVideoId(parsedId.data);
    const storage = getMediaStorage();
    for (const a of attachments) {
      await storage.remove(a.storageKey);
    }

    const deleted = await repo.delete(parsedId.data);
    if (!deleted) {
      return jsonNotFound({
        error: { code: "NOT_FOUND", message: "Video not found" },
      });
    }

    revalidatePath("/");
    revalidatePath(`/videos/${displayId}`);
    revalidatePath(`/videos/${displayId}/edit`);

    return jsonNoContent();
  } catch (e) {
    console.error(e);
    return jsonServerError({
      error: { code: "INTERNAL", message: "Failed to delete video" },
    });
  }
}
