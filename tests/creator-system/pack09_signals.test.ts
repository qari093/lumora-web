import { describe, it, expect } from "vitest";
import { createPresentSignal } from "@/src/lib/creator-system/signals/present";
import { createStillnessSignal } from "@/src/lib/creator-system/signals/stillness";
import { createHoldSignal } from "@/src/lib/creator-system/signals/hold";
import { createRewatchSignal } from "@/src/lib/creator-system/signals/rewatch";
import { createSilentOvationSignal } from "@/src/lib/creator-system/signals/silentOvation";

describe("Pack09 Human Signal Engine", () => {
  it("creates all signal types", () => {
    expect(createPresentSignal("u1").type).toBe("present");
    expect(createStillnessSignal("u1").type).toBe("stillness");
    expect(createHoldSignal("u1").type).toBe("hold");
    expect(createRewatchSignal("u1").type).toBe("rewatch");
    expect(createSilentOvationSignal("u1").type).toBe("silent-ovation");
  });
});
