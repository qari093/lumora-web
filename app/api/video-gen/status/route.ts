import { getJob } from "@/lib/video-gen/engine";

function j(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const jobId = (url.searchParams.get("jobId") || "").trim();
    if (!jobId) return j({ ok: false, error: "jobId_required", ts: Date.now() }, 400);

    const job = getJob(jobId);
    if (!job) return j({ ok: false, error: "not_found", ts: Date.now() }, 404);

    if (job.status === "done") {
      return j({ ok: true, jobId: job.jobId, status: "done", ts: Date.now() }, 200);
    }
    if (job.status === "failed") {
      return j({ ok: false, jobId: job.jobId, status: "failed", error: job.error || "failed", ts: Date.now() }, 200);
    }
    return j({ ok: true, jobId: job.jobId, status: job.status, ts: Date.now() }, 200);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return j({ ok: false, error: msg, ts: Date.now() }, 500);
  }
}
