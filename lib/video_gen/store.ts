import { prisma } from "@/lib/prisma";

export type VideoGenStatus = "queued" | "running" | "done" | "failed";

export type StoreOk<T> = { ok: true; data: T };
export type StoreErrCode = "bad_request" | "not_found" | "db_unavailable" | "internal_error";
export type StoreErr = { ok: false; code: StoreErrCode; detail?: string };

export type CreateJobInput = { prompt: string };
export type CreateJobOutput = { jobId: string };

export type JobRecord = {
  jobId: string;
  status: VideoGenStatus;
  resultUrl: string | null;
  error: string | null;
};

function genJobId(): string {
  return "vg_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function err(code: StoreErrCode, detail?: string): StoreErr {
  return { ok: false, code, detail };
}

export async function createJobInDb(
  input: CreateJobInput
): Promise<StoreOk<CreateJobOutput> | StoreErr> {
  if (!input?.prompt || typeof input.prompt !== "string" || input.prompt.trim() === "") {
    return err("bad_request", "prompt_required");
  }

  const jobId = genJobId();

  try {
    await prisma.videoGenJob.create({
      data: {
        id: jobId,
        prompt: input.prompt,
        status: "done",
        resultUrl: `https://example.invalid/video/${jobId}.mp4`,
        error: null,
      },
    });

    return { ok: true, data: { jobId } };
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "unknown";
    if (msg.includes("Database") || msg.includes("P100")) {
      return err("db_unavailable", msg);
    }
    return err("internal_error", msg);
  }
}

export async function getJobFromDb(
  jobId: string
): Promise<StoreOk<JobRecord> | StoreErr> {
  try {
    const row = await prisma.videoGenJob.findUnique({ where: { id: jobId } });
    if (!row) return err("not_found");

    return {
      ok: true,
      data: {
        jobId: row.id,
        status: row.status as VideoGenStatus,
        resultUrl: row.resultUrl,
        error: row.error,
      },
    };
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "unknown";
    if (msg.includes("Database") || msg.includes("P100")) {
      return err("db_unavailable", msg);
    }
    return err("internal_error", msg);
  }
}
