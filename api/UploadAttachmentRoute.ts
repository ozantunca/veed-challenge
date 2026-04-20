import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import {
  makeAttachmentStorageKey,
  safeFileSegment,
} from "@/lib/attachments/filename";
import {
  jsonBadRequest,
  jsonCreated,
  jsonNotFound,
  jsonServerError,
  zodErrorToFields,
} from "@/lib/api/response";
import {
  getAttachmentRepository,
  getVideoRepository,
} from "@/lib/repositories";
import { getMediaStorage } from "@/lib/storage";
import {
  MAX_ATTACHMENT_BYTES,
  isAllowedAttachmentMimeType,
} from "@/lib/validation/attachment-upload";
import { videoIdParamSchema } from "@/lib/validation/video";

export async function UploadAttachmentRoute(
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

    const videoRepo = getVideoRepository();
    const video = await videoRepo.getById(parsedId.data);
    if (!video) {
      return jsonNotFound({
        error: { code: "NOT_FOUND", message: "Video not found" },
      });
    }

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return jsonBadRequest({
        error: {
          code: "INVALID_FORM",
          message: "Expected multipart form data",
        },
      });
    }

    const file = form.get("file");
    if (!(file instanceof Blob)) {
      return jsonBadRequest({
        error: {
          code: "VALIDATION_ERROR",
          message: "Missing file field",
          fields: { file: "Choose a file" },
        },
      });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.length === 0) {
      return jsonBadRequest({
        error: {
          code: "VALIDATION_ERROR",
          message: "Empty file",
          fields: { file: "File is empty" },
        },
      });
    }
    if (buf.length > MAX_ATTACHMENT_BYTES) {
      return jsonBadRequest({
        error: {
          code: "FILE_TOO_LARGE",
          message: `File exceeds ${MAX_ATTACHMENT_BYTES} bytes`,
          fields: { file: "File is too large" },
        },
      });
    }

    const rawName =
      "name" in file && typeof file.name === "string" ? file.name : "";
    const displayName = rawName
      ? safeFileSegment(rawName)
      : "video.bin";

    const contentType =
      typeof file.type === "string" && file.type.trim().length > 0
        ? file.type.trim()
        : "application/octet-stream";

    if (!isAllowedAttachmentMimeType(contentType)) {
      return jsonBadRequest({
        error: {
          code: "INVALID_TYPE",
          message: "Only video/* uploads are allowed (or octet-stream)",
          fields: { file: "Unsupported file type" },
        },
      });
    }

    const storageKey = makeAttachmentStorageKey(
      parsedId.data,
      displayName,
    );
    const storage = getMediaStorage();

    try {
      await storage.upload(storageKey, buf);
    } catch (e) {
      console.error(e);
      return jsonServerError({
        error: { code: "STORAGE_ERROR", message: "Could not store file" },
      });
    }

    try {
      const attachmentRepo = getAttachmentRepository();
      const attachment = await attachmentRepo.create({
        videoId: parsedId.data,
        storageKey,
        filename: displayName,
        contentType,
        byteSize: buf.length,
      });

      revalidatePath("/");
      revalidatePath(`/videos/${video.displayId}`);
      revalidatePath(`/videos/${video.displayId}/edit`);

      return jsonCreated({ attachment });
    } catch (e) {
      console.error(e);
      await storage.remove(storageKey).catch(() => {});
      return jsonServerError({
        error: { code: "INTERNAL", message: "Could not save attachment" },
      });
    }
  } catch (e) {
    console.error(e);
    return jsonServerError({
      error: { code: "INTERNAL", message: "Failed to upload attachment" },
    });
  }
}
