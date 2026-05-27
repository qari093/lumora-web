import { execSync } from "node:child_process";

export function runFfprobe(filePath: string): any | null {
  try {
    const output = execSync(
      `ffprobe -v error -print_format json -show_streams -show_format "${filePath}"`
    );
    return JSON.parse(output.toString());
  } catch {
    return null;
  }
}
