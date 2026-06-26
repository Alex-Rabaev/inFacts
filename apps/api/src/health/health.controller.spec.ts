import { describe, expect, it } from "vitest";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  it("reports ok with service + timestamp", () => {
    const result = new HealthController().check();
    expect(result.status).toBe("ok");
    expect(result.service).toBe("infacts-api");
    expect(() => new Date(result.timestamp).toISOString()).not.toThrow();
  });
});
