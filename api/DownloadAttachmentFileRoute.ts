import { NextRequest, NextResponse } from 'next/server';

import { jsonBadRequest, jsonNotFound, jsonServerError, zodErrorToFields } from '@/lib/api/response';
import { getAttachmentRepository, getVideoRepository } from '@/lib/repositories';
import { getMediaStorage } from '@/lib/storage';
import { attachmentIdParamSchema, videoIdParamSchema } from '@/lib/validation/video';

function asciiFilename(name: string): string {
  return /[^\x20-\x7E]/.test(name) ? 'download.bin' : name.replace(/[^\x20-\x7E]+/g, '_');
}

export async function DownloadAttachmentFileRoute(
  _req: NextRequest,
  context: { params: Promise<{ id: string; attachmentId: string }> },
) {
  try {
    const p = await context.params;
    const idParsed = videoIdParamSchema.safeParse(p.id);
    if (!idParsed.success) {
      return jsonBadRequest({
        error: {
          code: 'INVALID_ID',
          message: 'Invalid video id',
          fields: zodErrorToFields(idParsed.error),
        },
      });
    }
    const attParsed = attachmentIdParamSchema.safeParse(p.attachmentId);
    if (!attParsed.success) {
      return jsonBadRequest({
        error: {
          code: 'INVALID_ID',
          message: 'Invalid attachment id',
          fields: zodErrorToFields(attParsed.error),
        },
      });
    }

    const video = await getVideoRepository().getById(idParsed.data);
    if (!video) {
      return jsonNotFound({
        error: { code: 'NOT_FOUND', message: 'Video not found' },
      });
    }

    const att = await getAttachmentRepository().getByIdForVideo(attParsed.data, idParsed.data);
    if (!att) {
      return jsonNotFound({
        error: { code: 'NOT_FOUND', message: 'Attachment not found' },
      });
    }

    let buffer: Buffer;
    try {
      buffer = await getMediaStorage().download(att.storageKey);
    } catch {
      return jsonNotFound({
        error: { code: 'NOT_FOUND', message: 'File missing on disk' },
      });
    }

    const safeName = asciiFilename(att.filename);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': att.contentType,
        'Content-Length': String(buffer.length),
        'Content-Disposition': `attachment; filename="${safeName}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (e) {
    console.error(e);
    return jsonServerError({
      error: { code: 'INTERNAL', message: 'Failed to download file' },
    });
  }
}
