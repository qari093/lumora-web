import { describe, expect, it } from "vitest";
import {
  autoAssignHost,
  autoBalanceCircleDensity,
  autoCleanInactiveUsers,
  autoTriggerReEngagement,
  validateAutomationSafety,
} from "@/src/lib/integration/automation-layer";

describe("Pack22 Automation Layer", () => {
  it("passes automation flow", () => {
    const density = autoBalanceCircleDensity({ attendees: 2 });
    const host = autoAssignHost({ hostIds: ["h1", "h2"], lastHostId: "h1" });
    const cleanedUsers = autoCleanInactiveUsers({
      users: [
        { id: "u1", active: true },
        { id: "u2", active: false },
      ],
    });
    const reengagement = autoTriggerReEngagement({ daysInactive: 14 });

    expect(density.action).toBe("merge");
    expect(host.hostId).toBe("h2");
    expect(cleanedUsers).toHaveLength(1);
    expect(reengagement.trigger).toBe(true);
    expect(validateAutomationSafety({ density, host, cleanedUsers, reengagement }).ok).toBe(true);
    expect(validateAutomationSafety({}).ok).toBe(false);
  });
});
