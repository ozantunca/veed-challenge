import type { CreateAttachmentInput, VideoAttachment } from "@/lib/types/video-attachment";

export interface AttachmentRepository {
  listByVideoId(videoId: number): Promise<VideoAttachment[]>;
  create(input: CreateAttachmentInput): Promise<VideoAttachment>;
  getByIdForVideo(attachmentId: number, videoId: number): Promise<VideoAttachment | null>;
  deleteByIdForVideo(attachmentId: number, videoId: number): Promise<boolean>;
}
