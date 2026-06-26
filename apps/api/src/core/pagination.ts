import type { Paginated } from "@infacts/shared";

/** Opaque base64url cursor encoding `(sortKey, id)` (AD-5). */
export function encodeCursor(sortKey: string | number, id: string): string {
  return Buffer.from(JSON.stringify([sortKey, id])).toString("base64url");
}

export function decodeCursor(cursor: string): [string | number, string] {
  const parsed: unknown = JSON.parse(
    Buffer.from(cursor, "base64url").toString("utf8"),
  );
  if (
    Array.isArray(parsed) &&
    parsed.length === 2 &&
    (typeof parsed[0] === "string" || typeof parsed[0] === "number") &&
    typeof parsed[1] === "string"
  ) {
    return [parsed[0], parsed[1]];
  }
  throw new Error("Invalid cursor");
}

export function paginate<T>(items: T[], nextCursor: string | null): Paginated<T> {
  return { items, nextCursor };
}
