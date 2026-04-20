export type VideoSort = "newest" | "oldest";

export type Video = {
  id: number;
  displayId: string;
  title: string;
  thumbnail_url: string;
  created_at: string;
  duration: number;
  views: number;
  tags: string[];
};

export type CreateVideoInput = {
  title: string;
  tags: string[];
};
