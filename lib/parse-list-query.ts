import { parseSort } from "@/lib/parse-sort";
import type { ListVideosOptions } from "@/lib/repositories/video-repository";

/** Next.js `searchParams` values may be `string | string[] | undefined`. */
export function firstSearchParam(
  v: string | string[] | undefined,
): string | undefined {
  if (v === undefined) return undefined;
  const s = Array.isArray(v) ? v[0] : v;
  return s;
}

function trimOrUndefined(s: string | undefined): string | undefined {
  const t = s?.trim();
  return t === "" || t === undefined ? undefined : t;
}

/**
 * Parses URL search params for the library list (sort + filters).
 */
export function parseListQuery(raw: {
  sort?: string;
  title?: string;
  tag?: string;
  from?: string;
  to?: string;
}): ListVideosOptions {
  const sort = parseSort(raw.sort);
  const titleContains = trimOrUndefined(raw.title);
  const tag = trimOrUndefined(raw.tag);

  let createdFrom: string | undefined;
  let createdTo: string | undefined;
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/;
  if (raw.from && dateOnly.test(raw.from)) {
    createdFrom = `${raw.from}T00:00:00.000Z`;
  }
  if (raw.to && dateOnly.test(raw.to)) {
    createdTo = `${raw.to}T23:59:59.999Z`;
  }

  return {
    sort,
    titleContains,
    tag,
    createdFrom,
    createdTo,
  };
}
