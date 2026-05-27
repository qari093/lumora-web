import { execSync } from "node:child_process";
import { buildMovieTrimPlan, buildFfmpegTrimCommand } from "../trim_plan";

export function trimMovieClip(inputPath: string, outputPath: string, duration: number): boolean {
  try {
    const plan = buildMovieTrimPlan(inputPath, outputPath, duration);
    const cmd = buildFfmpegTrimCommand(plan).join(" ");
    execSync(cmd);
    return true;
  } catch {
    return false;
  }
}
