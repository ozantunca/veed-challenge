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
import {
  attachmentIdParamSchema,
  videoIdParamSchema,
} from "@/lib/validation/video";

export async function DeleteAttachmentRoute(
  _req: NextRequest,
  context: { params: Promise<{ id: string; attachmentId: string }> },
) {
  try {
    const p = await context.params;
    const idParsed = videoIdParamSchema.safeParse(p.id);
    if (!idParsed.success) {
      return jsonBadRequest({
        error: {
          code: "INVALID_ID",
          message: "Invalid video id",
          fields: zodErrorToFields(idParsed.error),
        },
      });
    }
    const attParsed = attachmentIdParamSchema.safeParse(p.attachmentId);
    if (!attParsed.success) {
      return jsonBadRequest({
        error: {
          code: "INVALID_ID",
          message: "Invalid attachment id",
          fields: zodErrorToFields(attParsed.error),
        },
      });
    }

    const video = await getVideoRepository().getById(idParsed.data);
    if (!video) {
      return jsonNotFound({
        error: { code: "NOT_FOUND", message: "Video not found" },
      });
    }

    const attRepo = getAttachmentRepository();
    const att = await attRepo.getByIdForVideo(
      attParsed.data,
      idParsed.data,
    );
    if (!att) {
      return jsonNotFound({
        error: { code: "NOT_FOUND", message: "Attachment not found" },
      });
    }

    await getMediaStorage().remove(att.storageKey);
    const removed = await attRepo.deleteByIdForVideo(
      attParsed.data,
      idParsed.data,
    );
    if (!removed) {
      return jsonNotFound({
        error: { code: "NOT_FOUND", message: "Attachment not found" },
      });
    }

    revalidatePath("/");
    revalidatePath(`/videos/${video.displayId}`);
    revalidatePath(`/videos/${video.displayId}/edit`);

    return jsonNoContent();
  } catch (e) {
    console.error(e);
    return jsonServerError({
      error: { code: "INTERNAL", message: "Failed to delete attachment" },
    });
  }
}
