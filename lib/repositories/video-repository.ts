import type { CreateVideoInput, Video, VideoSort } from "@/lib/types/video";

export type ListVideosOptions = {
  sort: VideoSort;
};

export interface VideoRepository {
  list(options: ListVideosOptions): Promise<Video[]>;
  create(input: CreateVideoInput): Promise<Video>;
}
