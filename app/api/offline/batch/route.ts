import { NextResponse } from "next/server";
import zlib from "zlib";

export async function POST(req: Request) {
  try {
    const enc = req.headers.get("content-encoding") || "identity";
    const itemsHdr = req.headers.get("x-items");
    const itemsHint = itemsHdr ? parseInt(itemsHdr, 10) : undefined;

    const ab = await req.arrayBuffer();
    const u8 = new Uint8Array(ab);

    let jsonBytes: Uint8Array = u8;
    if (enc === "gzip") {
      jsonBytes = zlib.gunzipSync(Buffer.from(u8));
    } else if (enc !== "identity") {
      return NextResponse.json({ ok: false, error: "unsupported encoding" }, { status: 415 });
    }

    const text = new TextDecoder().decode(jsonBytes);
    const list = JSON.parse(text) as Array<{ t: number; kind: string; payload: unknown }>;

    // Here you could route by kind and persist server-side.
    const kinds = Array.from(new Set(list.map(x => x.kind))).sort();

    return NextResponse.json({
      ok: true,
      received: list.length,
      kinds,
      hinted: itemsHint ?? null,
      rawBytes: u8.byteLength,
      jsonBytes: jsonBytes.byteLength
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 400 });
  }
}
