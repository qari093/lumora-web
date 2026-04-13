import { describe, expect, it } from "vitest";
import {
  follow,
  unfollow,
  getFollowers,
  getFollowing,
  isFollowing
} from "../../lib/social/followSystem";

describe("follow system", () => {
  it("follows a user", () => {
    const state = follow({ relations: [] }, "u1", "u2");
    expect(isFollowing(state, "u1", "u2")).toBe(true);
  });

  it("prevents duplicate follows", () => {
    let state = follow({ relations: [] }, "u1", "u2");
    state = follow(state, "u1", "u2");
    expect(getFollowing(state, "u1")).toHaveLength(1);
  });

  it("unfollows correctly", () => {
    let state = follow({ relations: [] }, "u1", "u2");
    state = unfollow(state, "u1", "u2");
    expect(isFollowing(state, "u1", "u2")).toBe(false);
  });

  it("retrieves followers and following", () => {
    let state = { relations: [] as any[] };
    state = follow(state, "u1", "u2");
    state = follow(state, "u3", "u2");

    expect(getFollowers(state, "u2").sort()).toEqual(["u1", "u3"]);
    expect(getFollowing(state, "u1")).toEqual(["u2"]);
  });

  it("prevents self-follow", () => {
    const state = follow({ relations: [] }, "u1", "u1");
    expect(state.relations.length).toBe(0);
  });
});
