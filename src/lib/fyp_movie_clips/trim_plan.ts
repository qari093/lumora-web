export type MovieTrimPlan = {
  inputPath: string;
  outputPath: string;
  startSeconds: number;
  durationSeconds: number;
  normalizeAudio: boolean;
};

export function buildMovieTrimPlan(inputPath: string, outputPath: string, totalDuration: number): MovieTrimPlan {
  const safeTotal = Math.max(60, Number(totalDuration || 60));

  // Use longer clips for personal testing so sound is obvious.
  const durationSeconds = Math.min(32, Math.max(18, Math.floor(safeTotal * 0.008)));

  // Avoid title/producer/writer opening cards.
  // Start around 18% into the movie, but keep enough tail room.
  const startSeconds = Math.max(90, Math.min(Math.floor(safeTotal * 0.18), Math.floor(safeTotal - durationSeconds - 20)));

  return {
    inputPath,
    outputPath,
    startSeconds,
    durationSeconds,
    normalizeAudio: true,
  };
}

export function buildFfmpegTrimCommand(plan: MovieTrimPlan): string[] {
  return [
    "ffmpeg",
    "-y",
    "-ss",
    String(plan.startSeconds),
    "-i",
    plan.inputPath,
    "-t",
    String(plan.durationSeconds),
    "-map",
    "0:v:0",
    "-map",
    "0:a:0",
    "-vf",
    "scale=720:-2",
    "-af",
    plan.normalizeAudio ? "loudnorm=I=-16:TP=-1.5:LRA=11" : "anull",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-movflags",
    "+faststart",
    "-c:a",
    "aac",
    "-b:a",
    "160k",
    "-ar",
    "44100",
    "-ac",
    "2",
    plan.outputPath,
  ];
}
