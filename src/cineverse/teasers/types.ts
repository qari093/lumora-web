export type CineVerseTeaser = {
  id: string;
  filmId: string;
  title: string;
  emotionalHook: string;
  startSecond: number;
  endSecond: number;
  webmUrl: string;
  status: "draft" | "approved" | "published";
};
