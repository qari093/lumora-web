import { saveFeedback } from "@/src/lib/activation/feedbackStore";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.id || !body?.action) {
      return Response.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }

    saveFeedback({
      id: body.id,
      action: body.action,
      ts: Date.now()
    });

    return Response.json({
      ok: true,
      status: "saved"
    });
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
