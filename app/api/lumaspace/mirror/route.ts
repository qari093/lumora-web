import { NextResponse } from "next/server";
import { prisma } from "@/app/_server/prisma";

type Emotion = string;

function summarize(emotions: Emotion[]) {
  const counts: Record<string, number> = {};
  for (const e of emotions) {
    const k = (e || "unknown").toLowerCase();
    counts[k] = (counts[k] || 0) + 1;
  }
  const total = emotions.length || 0;
  const entries = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  const top = entries[0]?.[0] || null;

  // crude scores from label (fallback to neutral)
  const scoreOf = (k: string) => {
    switch(k){
      case "calm": return { calm: 0.9, focus: 0.7 };
      case "focus": return { calm: 0.6, focus: 0.9 };
      case "joy": return { calm: 0.75, focus: 0.65 };
      case "curious": return { calm: 0.6, focus: 0.8 };
      case "anxious": return { calm: 0.25, focus: 0.35 };
      case "sad": return { calm: 0.3, focus: 0.4 };
      case "angry": return { calm: 0.15, focus: 0.5 };
      case "neutral": return { calm: 0.55, focus: 0.55 };
      default: return { calm: 0.5, focus: 0.5 };
    }
  };

  let calm = 0, focus = 0;
  for(const [k, n] of entries){
    const w = n / Math.max(1,total);
    const s = scoreOf(k);
    calm += s.calm * w;
    focus += s.focus * w;
  }

  return {
    total,
    topEmotion: top,
    mix: entries.map(([k,v])=>({ emotion:k, count:v, pct: total? +(v*100/total).toFixed(1): 0 })),
    scores: {
      calm: +(calm*100).toFixed(1),
      focus: +(focus*100).toFixed(1)
    },
    updatedAt: new Date().toISOString()
  };
}

async function worldIdByEmail(email: string){
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) user = await prisma.user.create({ data: { email } });
  let world = await prisma.userWorld.findFirst({ where: { userId: user.id } });
  if (!world) {
    world = await prisma.userWorld.create({
      data: { userId: user.id, name: "Founders Space", theme: "aurora", mood: "inspired" }
    });
  }
  return world.id;
}

export async function GET(req: Request){
  try{
    const u = new URL(req.url);
    const email = String(u.searchParams.get("email")||"").trim();
    const take = Math.min(Math.max(parseInt(String(u.searchParams.get("take")||"30"),10)||30, 5), 200);
    if(!email) return NextResponse.json({ ok:false, error:"email required" }, { status:400 });

    const worldId = await worldIdByEmail(email);
    const journal = await prisma.shadowJournal.findFirst({ where: { worldId } });
    if(!journal) return NextResponse.json({ ok:true, worldId, total:0, mirror: summarize([]) });

    const rows = await prisma.shadowEntry.findMany({
      where: { journalId: journal.id },
      orderBy: { createdAt: "desc" },
      take,
      select: { emotion: true }
    });

    const emotions = rows.map(r => (r.emotion ?? "neutral"));
    const mirror = summarize(emotions);

    return NextResponse.json({ ok:true, worldId, total: mirror.total, mirror });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: String(e?.message||e) }, { status:500 });
  }
}

export const dynamic = "force-dynamic";
