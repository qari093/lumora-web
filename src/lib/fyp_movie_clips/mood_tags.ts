export function inferMovieClipMood(value: string): string {
  const s = value.toLowerCase();

  if (s.includes("comedy") || s.includes("funny")) return "amused";
  if (s.includes("horror") || s.includes("mystery")) return "tense";
  if (s.includes("romance") || s.includes("love")) return "warm";
  if (s.includes("war") || s.includes("crime")) return "heavy";
  if (s.includes("trailer") || s.includes("voice")) return "curious";

  return "cinematic";
}

export function inferMovieClipCategory(value: string): string {
  const s = value.toLowerCase();

  if (s.includes("comedy")) return "Comedy";
  if (s.includes("horror")) return "Horror";
  if (s.includes("drama")) return "Drama";
  if (s.includes("trailer")) return "Trailer";
  if (s.includes("street") || s.includes("crowd")) return "Archive Life";

  return "Movie Moment";
}
