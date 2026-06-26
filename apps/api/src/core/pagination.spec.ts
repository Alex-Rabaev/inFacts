import { describe, expect, it } from "vitest";
import { decodeCursor, encodeCursor, paginate } from "./pagination";

describe("cursor", () => {
  it("round-trips sortKey + id", () => {
    const cursor = encodeCursor(1719440000000, "abc-123");
    expect(decodeCursor(cursor)).toEqual([1719440000000, "abc-123"]);
  });

  it("rejects a malformed cursor", () => {
    expect(() => decodeCursor("not-a-cursor")).toThrow();
  });
});

describe("paginate", () => {
  it("wraps items with a nextCursor", () => {
    expect(paginate([1, 2], "next")).toEqual({ items: [1, 2], nextCursor: "next" });
    expect(paginate([], null)).toEqual({ items: [], nextCursor: null });
  });
});
