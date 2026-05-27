import { describe, expect, it } from "vitest";
import { createNotification } from "@/core/notifications/runtime";

describe("notification runtime", () => {
  it("creates notifications", () => {
    expect(createNotification("hello").created).toBe(true);
  });
});
