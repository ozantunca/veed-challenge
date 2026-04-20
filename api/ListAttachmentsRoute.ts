import { NextRequest } from "next/server";

import {
  jsonBadRequest,
  jsonNotFound,
  jsonOk,
  jsonServerError,
  zodErrorToFields,
} from "@/lib/api/response";
import { getAttachmentRepository, getVideoRepository } from "@/lib/repositories";
import { videoIdParamSchema } from "@/lib/validation/video";

export async function ListAttachmentsRoute(
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

    const videoRepo = getVideoRepository();
    const video = await videoRepo.getById(parsedId.data);
    if (!video) {
      return jsonNotFound({
        error: { code: "NOT_FOUND", message: "Video not found" },
      });
    }

    const attachments = await getAttachmentRepository().listByVideoId(
      parsedId.data,
    );
    return jsonOk({ attachments });
  } catch (e) {
    console.error(e);
    return jsonServerError({
      error: { code: "INTERNAL", message: "Failed to list attachments" },
    });
  }
}
