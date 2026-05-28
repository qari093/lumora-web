import { describe, expect, it } from "vitest";
import { createSquadEcho } from "@/lib/gmar/squadEcho";

describe("squad echo", () => {
  it("creates permanent shared memory", () => {
    const echo = createSquadEcho("squad-1", 5);

    expect(echo.permanent).toBe(true);
    expect(echo.members).toBe(5);
  });
});
