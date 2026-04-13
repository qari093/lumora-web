import { describe, expect, it } from "vitest";
import { evaluateProfileCompletion } from "../../lib/profile/completionFlow";

describe("user profile completion flow", () => {
  it("returns 100% for complete profile", () => {
    const result = evaluateProfileCompletion({
      id: "u1",
      handle: "@waqar",
      displayName: "Waqar",
      avatarUrl: "https://cdn.example.com/a.png",
      bio: "Building Lumora",
      interests: ["video", "design"]
    });

    expect(result.percent).toBe(100);
    expect(result.isComplete).toBe(true);
    expect(result.missingFields).toEqual([]);
  });

  it("returns partial completion for incomplete profile", () => {
    const result = evaluateProfileCompletion({
      id: "u1",
      handle: "@waqar",
      displayName: "Waqar"
    });

    expect(result.percent).toBe(40);
    expect(result.isComplete).toBe(false);
    expect(result.missingFields).toEqual(["avatarUrl", "bio", "interests"]);
  });

  it("treats empty strings and empty arrays as missing", () => {
    const result = evaluateProfileCompletion({
      id: "u1",
      handle: "   ",
      displayName: "Waqar",
      avatarUrl: "",
      bio: " ",
      interests: []
    });

    expect(result.completedFields).toEqual(["displayName"]);
    expect(result.missingFields).toEqual(["handle", "avatarUrl", "bio", "interests"]);
  });
});
