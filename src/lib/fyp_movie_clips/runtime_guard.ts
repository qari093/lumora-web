import { isMovieClipsEnabled } from "./kill_switch";

export function filterMovieClipsRuntime(items: any[]) {
  if (!isMovieClipsEnabled()) {
    return items.filter((x) => x.sourceType !== "movie-clip");
  }
  return items;
}
