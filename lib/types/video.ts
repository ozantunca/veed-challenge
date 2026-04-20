export type VideoSort = "newest" | "oldest";

export type Video = {
  id: number;
  displayId: string;
  title: string;
  description: string;
  thumbnail_url: string;
  created_at: string;
  duration: number;
  views: number;
  tags: string[];
};

export type CreateVideoInput = {
  title: string;
  description?: string;
  tags: string[];
};

export type UpdateVideoInput = {
  title: string;
  description: string;
  tags: string[];
};
