import fs from "node:fs";
import path from "node:path";

export type RenderProgress = {
  jobId: string;
  pct: number;
  stage: string;
  updatedAt: string;
};

const PROGRESS_DIR = path.join(process.cwd(), ".data", "render", "progress");

function normalizeJobId(jobId: string): string {
  const value = String(jobId || "").trim();
  if (!value) throw new Error("jobId is required");
  return value.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function fileFor(jobId: string): string {
  return path.join(PROGRESS_DIR, `${normalizeJobId(jobId)}.json`);
}

export function writeProgress(input: {
  jobId: string;
  pct: number;
  stage: string;
}): RenderProgress {
  const progress: RenderProgress = {
    jobId: normalizeJobId(input.jobId),
    pct: Math.max(0, Math.min(100, Number(input.pct) || 0)),
    stage: String(input.stage || "unknown"),
    updatedAt: new Date().toISOString(),
  };

  fs.mkdirSync(PROGRESS_DIR, { recursive: true });
  fs.writeFileSync(fileFor(progress.jobId), JSON.stringify(progress, null, 2), "utf8");
  return progress;
}

export function readProgress(jobId: string): RenderProgress {
  const normalized = normalizeJobId(jobId);
  const target = fileFor(normalized);

  if (!fs.existsSync(target)) {
    return {
      jobId: normalized,
      pct: 0,
      stage: "unknown",
      updatedAt: new Date(0).toISOString(),
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(target, "utf8")) as Partial<RenderProgress>;
    return {
      jobId: normalized,
      pct: Math.max(0, Math.min(100, Number(parsed.pct) || 0)),
      stage: typeof parsed.stage === "string" ? parsed.stage : "unknown",
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date(0).toISOString(),
    };
  } catch {
    return {
      jobId: normalized,
      pct: 0,
      stage: "unknown",
      updatedAt: new Date(0).toISOString(),
    };
  }
}
