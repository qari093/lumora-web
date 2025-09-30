import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Track = { id:string; title:string; artist:string; genre?:string; energy?:string; bpm?:number; url:string };

function loadCatalog(): Track[] {
  const p = path.join(process.cwd(), "public", "music", "manifest.json");
  try { const j = JSON.parse(fs.readFileSync(p,"utf8")); return j.catalog || []; } catch { return []; }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const genre = (searchParams.get("genre") || "").toLowerCase().trim();
  const energy = (searchParams.get("energy") || "").toLowerCase().trim();

  let items = loadCatalog();
  if (q) items = items.filter(t =>
     t.title.toLowerCase().includes(q) ||
     t.artist.toLowerCase().includes(q) ||
     (t.genre||"").toLowerCase().includes(q) ||
     (t.energy||"").toLowerCase().includes(q)
  );
  if (genre) items = items.filter(t => (t.genre||"").toLowerCase() === genre);
  if (energy) items = items.filter(t => (t.energy||"").toLowerCase() === energy);

  return NextResponse.json({ ok:true, items }, { status:200 });
}
