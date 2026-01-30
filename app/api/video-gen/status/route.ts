import { getJobFromDb } from "@/lib/video_gen/store";

export const runtime = "nodejs";

function json(body: any, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function mapStoreToHttp(r: any): { status: number; body: any } {
  if (r?.ok === true) {
    const j = r.data;
    return {
      status: 200,
      body: {
        ok: true,
        job: {
          jobId: j.jobId,
          status: j.status,
          resultUrl: j.resultUrl,
          error: j.error,
        },
      },
    };
  }

  const code = String(r?.code || "internal_error");
  const detail = typeof r?.detail === "string" ? r.detail : undefined;

  if (code === "bad_request") return { status: 400, body: { ok: false, error: "bad_request", detail } };
  if (code === "not_found") return { status: 404, body: { ok: false, error: "not_found", detail } };
  if (code === "db_unavailable") return { status: 503, body: { ok: false, error: "db_unavailable", detail } };

  return { status: 500, body: { ok: false, error: "internal_error", detail } };
}

export async function GET(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const jobId = url.searchParams.get("jobId") || "";
    if (!jobId) return json({ ok: false, error: "bad_request", detail: "jobId_required" }, 400);

    const r = await getJobFromDb(jobId);
    const mapped = mapStoreToHttp(r);
    return json(mapped.body, mapped.status);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "unknown";
    return json({ ok: false, error: "internal_error", detail: msg }, 500);
  }
}
