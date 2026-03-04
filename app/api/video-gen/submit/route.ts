import { createJob } from "@/lib/video-gen/engine";

function j(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  try {
    const ct = (req.headers.get("content-type") || "").toLowerCase();
    if (!ct.includes("application/json")) return j({ ok: false, error: "bad_request", ts: Date.now() }, 400);

    const body = await req.json().catch(() => null);
    const prompt = (body?.prompt ?? "").toString().trim();

    // Keep the existing contract: invalid prompt => reject
    if (!prompt || prompt.length < 3 || prompt.length > 800) {
      return j({ ok: false, error: "bad_request", ts: Date.now() }, 400);
    }

    const job = createJob(prompt);
    return j({ ok: true, jobId: job.jobId, ts: Date.now() }, 200);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return j({ ok: false, error: msg, ts: Date.now() }, 500);
  }
}
