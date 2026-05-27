import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Final FYP + Creator Dashboard Contract", () => {
  it("has all production-critical files wired", () => {
    const required = [
      "app/fyp/page.tsx",
      "app/creator/dashboard/page.tsx",
      "components/fyp/FypFullPlayer.tsx",
      "components/fyp/FypRuntimeVideoSignalBridge.tsx",
      "components/creator-dashboard/CreatorDashboardClient.tsx",
      "components/creator-dashboard/useRuntimeState.ts",
      "app/api/runtime/signals/route.ts",
      "app/api/runtime/events/route.ts",
      "app/api/runtime/state/route.ts",
      "src/runtime/runtimeStore.ts",
      "src/runtime/runtimeBridge.ts",
      "src/runtime/realtimeState.ts",
      "src/runtime/runtimeEventValidation.ts",
      "src/db/client.ts",
      "prisma/schema.prisma",
    ];

    for (const file of required) {
      expect(fs.existsSync(file), `${file} missing`).toBe(true);
    }
  });
});
