import { NextRequest, NextResponse } from "next/server";
import { upsertVideo } from "@/src/lib/stream/store";
import { reqId } from "@/src/lib/reqid";

type CFDirectUploadResp = { result?: { uploadURL: string; uid: string }; success: boolean; errors?: any[] };

export async function POST(req: NextRequest) {
  const id = reqId();
  const ACC = process.env.CF_STREAM_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
  const TOK = process.env.CF_STREAM_TOKEN || process.env.CLOUDFLARE_STREAM_TOKEN; // API Token with Stream:Edit
  const MAX_S = Number(process.env.STREAM_MAX_SECONDS || "180"); // default 3 minutes

  if (!ACC || !TOK) {
    return NextResponse.json({
      ok: false,
      disabled: true,
      error: "STREAM_NOT_CONFIGURED",
      need: ["CF_STREAM_ACCOUNT_ID", "CF_STREAM_TOKEN"],
      requestId: id
    }, { status: 200, headers: { "x-request-id": id } });
  }

  let payload: any = {};
  try { payload = await req.json(); } catch {}
  const requireSignedURLs = !!payload?.requireSigned || false;

  try {
    const resp = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACC}/stream/direct_upload`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${TOK}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        // These fields are supported by Cloudflare Stream direct uploads
        maxDurationSeconds: MAX_S,
        requireSignedURLs
      })
    });
    const data = await resp.json() as CFDirectUploadResp;

    if (!resp.ok || !data?.success || !data?.result?.uploadURL) {
      return NextResponse.json({
        ok: false,
        error: "CF_API_ERROR",
        status: resp.status,
        data,
        requestId: id
      }, { status: 200, headers: { "x-request-id": id } });
    }

    // seed store
    if (data.result?.uid) {
      upsertVideo(data.result.uid, { status: "created" });
    }

    return NextResponse.json({
      ok: true,
      uploadURL: data.result.uploadURL,
      uid: data.result.uid,
      maxSeconds: MAX_S,
      requestId: id
    }, { status: 200, headers: { "x-request-id": id } });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:"NETWORK_OR_FETCH_ERROR", message:String(e?.message||e), requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }
}
export const dynamic = "force-dynamic";
