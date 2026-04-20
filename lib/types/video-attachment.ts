export type VideoAttachment = {
  id: number;
  videoId: number;
  storageKey: string;
  filename: string;
  contentType: string;
  byteSize: number;
  createdAt: string;
};

export type CreateAttachmentInput = {
  videoId: number;
  storageKey: string;
  filename: string;
  contentType: string;
  byteSize: number;
};
