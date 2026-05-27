export type CineVerseFypCardType =
  | "emotional-teaser"
  | "film-card"
  | "civilization-wave"
  | "memory-echo"
  | "emotional-dust"
  | "discovery-trail"
  | "emotional-keyframes";

export type CineVerseFypCard = {
  id: string;
  type: CineVerseFypCardType;
  title: string;
  emotionalHook: string;
  priority: number;
};
