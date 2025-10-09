import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

function guessType(p: string) {
  if (p.endsWith(".mp4")) return "video/mp4";
  if (p.endsWith(".webm")) return "video/webm";
  if (p.endsWith(".mp3")) return "audio/mpeg";
  if (p.endsWith(".wav")) return "audio/wav";
  return "application/octet-stream";
}

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string[] } }
) {
  try {
    const rel = params.slug.join("/");
    // Only allow files under ./out/
    const root = path.join(process.cwd(), "out");
    const abs = path.join(process.cwd(), rel.startsWith("out/") ? rel : path.join("out", rel));

    if (!abs.startsWith(root)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const stat = await fs.stat(abs);
    if (!stat.isFile()) {
      return NextResponse.json({ error: "not a file" }, { status: 400 });
    }

    const data = await fs.readFile(abs);
    return new Response(data, {
      headers: {
        "content-type": guessType(abs),
        "cache-control": "no-store",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 404 });
  }
}
