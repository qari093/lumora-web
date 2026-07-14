import fs from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import {
  getLumoraRuntimeEnvironment,
  getLumoraRuntimeMetadata,
  getLumoraVersion,
} from "@/src/lib/runtime/deploymentMetadata";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("Soft Launch Pack 01 — runtime health contracts", () => {
  it("prioritizes Vercel deployment environment", () => {
    process.env.VERCEL_ENV = "production";
    process.env.NEXT_PUBLIC_APP_ENV = "development";

    expect(getLumoraRuntimeEnvironment()).toBe("production");
  });

  it("normalizes unsupported environments safely", () => {
    delete process.env.VERCEL_ENV;
    process.env.APP_ENV = "unknown";

    expect(getLumoraRuntimeEnvironment()).toBe("development");
  });

  it("resolves configured application version", () => {
    process.env.APP_VERSION = "v8.0.0";

    expect(getLumoraVersion()).toBe("v8.0.0");
  });

  it("exposes deployment metadata without undefined values", () => {
    process.env.VERCEL_ENV = "preview";
    process.env.VERCEL_GIT_COMMIT_SHA = "abc123";

    expect(getLumoraRuntimeMetadata()).toMatchObject({
      service: "lumora-web",
      appEnv: "preview",
      commitSha: "abc123",
    });
  });

  it("locks canonical health, readiness, and version routes", () => {
    const health = fs.readFileSync("app/api/health/route.ts", "utf8");
    const ready = fs.readFileSync("app/api/ready/route.ts", "utf8");
    const version = fs.readFileSync("app/api/version/route.ts", "utf8");

    expect(health).toContain("getLumoraRuntimeMetadata");
    expect(ready).toContain('databaseReadinessRoute: "/api/readyz"');
    expect(version).toContain("getLumoraRuntimeMetadata");
  });

  it("locks Vercel builds to Node.js 24", () => {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

    expect(packageJson.engines.node).toBe("24.x");
  });
});
