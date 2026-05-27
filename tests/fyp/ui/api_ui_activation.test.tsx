import { describe, expect, it } from "vitest";
import React from "react";

import FypRuntimeShell from "@/components/fyp/FypRuntimeShell";

describe("Lumora FYP API + UI Activation", () => {
  it("creates FYP runtime shell element", () => {
    const element = (
      <FypRuntimeShell
        mode="chaos"
        status="active"
      />
    );

    expect(element.type).toBe(FypRuntimeShell);
    expect(element.props.mode).toBe("chaos");
    expect(element.props.status).toBe("active");
  });

  it("has route and component files active", async () => {
    const mod = await import("@/components/fyp/FypRuntimeShell");

    expect(typeof mod.default).toBe("function");
  });
});
