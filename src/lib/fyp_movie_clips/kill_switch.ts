let MOVIE_CLIPS_ENABLED = true;

export function isMovieClipsEnabled(): boolean {
  return MOVIE_CLIPS_ENABLED;
}

export function disableMovieClips() {
  MOVIE_CLIPS_ENABLED = false;
}

export function enableMovieClips() {
  MOVIE_CLIPS_ENABLED = true;
}
