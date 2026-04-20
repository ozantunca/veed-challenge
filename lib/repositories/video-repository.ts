import type {
  CreateVideoInput,
  UpdateVideoInput,
  Video,
  VideoSort,
} from "@/lib/types/video";

export type ListVideosOptions = {
  sort: VideoSort;
  titleContains?: string;
  tag?: string;
  createdFrom?: string;
  createdTo?: string;
};

export interface VideoRepository {
  list(options: ListVideosOptions): Promise<Video[]>;
  create(input: CreateVideoInput): Promise<Video>;
  getById(id: number): Promise<Video | null>;
  update(id: number, input: UpdateVideoInput): Promise<Video | null>;
  delete(id: number): Promise<boolean>;
}
