export type DebateVersusType =
  | "teaser-vs-teaser"
  | "movie-vs-movie"
  | "music-vs-music"
  | "gaming-vs-gaming";

export type DebateVersusCardSchema = {
  id: string;
  type: "debate-versus";
  versusType: DebateVersusType;

  left: {
    id: string;
    title: string;
    posterUrl?: string;
    metadata?: Record<string, unknown>;
  };

  right: {
    id: string;
    title: string;
    posterUrl?: string;
    metadata?: Record<string, unknown>;
  };

  prompt: string;

  stats: {
    leftVotes: number;
    rightVotes: number;
    totalVotes: number;
  };

  createdAt: string;
  expiresAt?: string;
};

export function createDebateVersusCard(
  input: Omit<DebateVersusCardSchema, "stats">
): DebateVersusCardSchema {
  return {
    ...input,
    stats: {
      leftVotes: 0,
      rightVotes: 0,
      totalVotes: 0,
    },
  };
}
