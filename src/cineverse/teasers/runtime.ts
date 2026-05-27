import type { CineVerseTeaser } from "./types";

export function createTeaserDraft(input: {
  filmId: string;
  title: string;
  emotionalHook: string;
  startSecond: number;
  endSecond: number;
}): CineVerseTeaser {
  if (input.endSecond <= input.startSecond) {
    throw new Error("INVALID_TEASER_RANGE");
  }

  return {
    id: `teaser-${input.filmId}-${input.startSecond}-${input.endSecond}`,
    filmId: input.filmId,
    title: input.title,
    emotionalHook: input.emotionalHook,
    startSecond: input.startSecond,
    endSecond: input.endSecond,
    webmUrl: `/cineverse/teasers/${input.filmId}.webm`,
    status: "draft",
  };
}

export function approveTeaser(teaser: CineVerseTeaser): CineVerseTeaser {
  return {
    ...teaser,
    status: "approved",
  };
}
