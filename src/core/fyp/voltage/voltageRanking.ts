import type { RushLanePost } from "../rush/types";

export type VoltageRankedPost = RushLanePost & {
  voltageScore: number;
  rank: number;
};

export function rankRushVoltagePosts(
  posts: RushLanePost[]
): VoltageRankedPost[] {
  return [...posts]
    .map(post => ({
      ...post,
      voltageScore:
        post.intensity * 10 +
        post.voltageSeed
    }))
    .sort((a, b) => b.voltageScore - a.voltageScore)
    .map((post, index) => ({
      ...post,
      rank: index + 1
    }));
}
