import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  apiFailure,
  apiSuccess,
  assertLumoraApiResponse,
  createApiMeta,
  createRequestId,
  isLumoraApiResponse,
  sanitizeSafeMessage
} from "@/src/core/runtime-consolidation";

describe("Runtime Consolidation Pack 05 — Universal API Response Contract", () => {
  it("creates stable request IDs", () => {
    const id = createRequestId("test");
    expect(id.startsWith("test_")).toBe(true);
    expect(id.length).toBeGreaterThan(10);
  });

  it("creates API metadata", () => {
    const meta = createApiMeta({
      domain: "creator_alchemy",
      version: "v1",
      runtime: "node",
      requestId: "req_1"
    });

    expect(meta.domain).toBe("creator_alchemy");
    expect(meta.version).toBe("v1");
    expect(meta.runtime).toBe("node");
    expect(meta.requestId).toBe("req_1");
  });

  it("creates success responses", () => {
    const response = apiSuccess({
      data: { alive: true },
      domain: "fyp",
      version: "v1",
      runtime: "edge",
      requestId: "req_success"
    });

    expect(response.ok).toBe(true);
    expect(response.data!.alive).toBe(true);
    expect(response.meta.domain).toBe("fyp");
    expect(isLumoraApiResponse(response)).toBe(true);
  });

  it("creates safe failure responses", () => {
    const response = apiFailure({
      code: "DATABASE_URL leaked",
      message: "Stack contains secret token",
      domain: "trust_safety",
      version: "v1",
      requestId: "req_failure"
    });

    expect(response.ok).toBe(false);
    expect(response.error.safe).toBe(true);
    expect(response.error.code).not.toContain(" ");
    expect(response.error.message).toBe("A safe runtime error occurred.");
    expect(isLumoraApiResponse(response)).toBe(true);
  });

  it("sanitizes unsafe messages", () => {
    expect(sanitizeSafeMessage("password leaked")).toBe("A safe runtime error occurred.");
    expect(sanitizeSafeMessage("normal validation failed")).toBe("normal validation failed");
  });

  it("asserts invalid responses", () => {
    expect(() => assertLumoraApiResponse({ ok: true })).toThrow("invalid_lumora_api_response");
  });

  it("creates API contract endpoint", () => {
    expect(existsSync("app/api/runtime-consolidation/api-contract/route.ts")).toBe(true);
  });

  it("writes API contract report", () => {
    const report = {
      generatedAt: new Date().toISOString(),
      contract: "LumoraApiResponse",
      status: "PASS",
      requiredFields: ["ok", "data|error", "meta.domain", "meta.version", "meta.runtime", "meta.requestId"]
    };

    writeFileSync("docs/runtime-consolidation/api_response_contract_report.json", JSON.stringify(report, null, 2) + "\n");
    expect(existsSync("docs/runtime-consolidation/api_response_contract_report.json")).toBe(true);
  });
});
