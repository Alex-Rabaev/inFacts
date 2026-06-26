/** Canonical API error envelope (AD-5). */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/** Uniform cursor-pagination envelope (AD-5). */
export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
}

/** Query parameters for cursor-paginated list endpoints. */
export interface PageQuery {
  cursor?: string;
  limit?: number;
}

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;

/** Clamp a requested page size into the allowed range (AD-5). */
export function clampLimit(limit?: number): number {
  if (limit === undefined || Number.isNaN(limit) || limit < 1) {
    return DEFAULT_PAGE_SIZE;
  }
  return Math.min(Math.floor(limit), MAX_PAGE_SIZE);
}
