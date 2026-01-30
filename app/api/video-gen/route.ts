import { createJobInDb } from "@/lib/video_gen/store";

export const runtime = "nodejs";

function json(body: any, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function mapStoreToHttp(r: any): { status: number; body: any } {
  if (r?.ok === true) return { status: 200, body: { ok: true, jobId: r.data.jobId } };

  const code = String(r?.code || "internal_error");
  const detail = typeof r?.detail === "string" ? r.detail : undefined;

  if (code === "bad_request") return { status: 400, body: { ok: false, error: "bad_request", detail } };
  if (code === "not_found") return { status: 404, body: { ok: false, error: "not_found", detail } };
  if (code === "db_unavailable") return { status: 503, body: { ok: false, error: "db_unavailable", detail } };

  return { status: 500, body: { ok: false, error: "internal_error", detail } };
}

export async function POST(req: Request): Promise<Response> {
  try {
    const ct = (req.headers.get("content-type") || "").toLowerCase();
    if (!ct.includes("application/json")) return json({ ok: false, error: "bad_request", detail: "json_required" }, 400);

    let payload: any = null;
    try {
      payload = await req.json();
    } catch {
      return json({ ok: false, error: "bad_request", detail: "invalid_json" }, 400);
    }

    const prompt = typeof payload?.prompt === "string" ? payload.prompt : "";
    const r = await createJobInDb({ prompt });

    const mapped = mapStoreToHttp(r);
    return json(mapped.body, mapped.status);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "unknown";
    return json({ ok: false, error: "internal_error", detail: msg }, 500);
  }
}
