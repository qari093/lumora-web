export type Fyp94NarrativeClip = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  thrillScore: number;
};

export type Fyp94NarrativeSequence = {
  sequenceId: string;
  category: string;
  setup: Fyp94NarrativeClip;
  tension: Fyp94NarrativeClip;
  payoff: Fyp94NarrativeClip;
  state: "ready" | "active" | "completed" | "abandoned";
};
