import { describe, expect, it } from "vitest";
import { sessionPersistence } from "@/src/core/auth/session/sessionPersistence";

describe("codepack08", () => {
  it("auth runtime works", () => {
    expect(sessionPersistence.secure).toBe(true);
  });
});
