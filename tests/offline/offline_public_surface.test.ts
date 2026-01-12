import { describe, it, expect } from "vitest";
import * as S from "../../src/lib/offline/videos";

describe("offline videos: public barrel surface", () => {
  it("exports stable surface (signFrame/verifyFrame)", () => {
    expect(typeof (S as any).signFrame).toBe("function");
    expect(typeof (S as any).verifyFrame).toBe("function");
  });
});
