const DISPLAY_PREFIX = "v-";

/**
 * User-facing ID: `v-` + numeric part left-padded to at least 3 digits.
 */
export function toDisplayId(n: number): string {
  if (!Number.isFinite(n) || n < 1) {
    throw new Error(`Invalid id for display: ${n}`);
  }
  return `${DISPLAY_PREFIX}${n.toString().padStart(3, "0")}`;
}

/**
 * Parse `v-001` … `v-123` → integer id.
 */
export function fromDisplayId(s: string): number {
  const trimmed = s.trim();
  if (!trimmed.toLowerCase().startsWith(DISPLAY_PREFIX)) {
    throw new Error(`Invalid display id: ${s}`);
  }
  const rest = trimmed.slice(DISPLAY_PREFIX.length);
  const n = Number.parseInt(rest, 10);
  if (!Number.isFinite(n) || n < 1) {
    throw new Error(`Invalid display id: ${s}`);
  }
  return n;
}
