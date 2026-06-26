import { describe, expect, it } from "vitest";
import { clampLimit, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "./api";

describe("clampLimit", () => {
  it("defaults when missing or invalid", () => {
    expect(clampLimit(undefined)).toBe(DEFAULT_PAGE_SIZE);
    expect(clampLimit(0)).toBe(DEFAULT_PAGE_SIZE);
    expect(clampLimit(-5)).toBe(DEFAULT_PAGE_SIZE);
  });

  it("caps at the maximum page size", () => {
    expect(clampLimit(1000)).toBe(MAX_PAGE_SIZE);
  });

  it("passes through valid sizes", () => {
    expect(clampLimit(5)).toBe(5);
    expect(clampLimit(50)).toBe(50);
  });
});
