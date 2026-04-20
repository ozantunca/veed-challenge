/**
 * Pluggable blob storage. Keys are POSIX-style paths relative to the storage root
 * (e.g. `videos/12/uuid_name.mp4`), using `/` only.
 */
export type MediaStorage = {
  upload(key: string, data: Buffer): Promise<void>;
  download(key: string): Promise<Buffer>;
  /** Returns keys starting with `prefix` (e.g. `videos/5/`). */
  list(prefix: string): Promise<string[]>;
  remove(key: string): Promise<void>;
};
