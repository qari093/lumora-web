import { NextResponse, NextRequest } from "next/server";

type SafetyTier = "clean" | "fashion" | "spicy-safe";
type ShotPlanItem = { label:string; desc:string; durationSec:number; lens:string; motion:string };

function safeStr(v:any){ return String(v ?? "").trim().slice(0,160); }
function clamp(n:number,min:number,max:number){ return Math.max(min, Math.min(max, n)); }
function seedFrom(s:string){ let h=2166136261>>>0; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619);} return (h>>>0)/4294967296; }
function pick<T>(arr:T[], k:number, seed:number){ const a=arr.slice(); const out:T[]=[]; let r=seed;
  for(let i=0;i<Math.min(k,a.length);i++){ r=(r*9301+49297)%233280; const idx=Math.floor((r/233280)*a.length); out.push(a[idx]); a.splice(idx,1); }
  return out;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "http://127.0.0.1:3010",
      "Vary": "Origin",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "600",
    },
  });
}

export async function POST(req: NextRequest) {
  // CORS headers
  const cors = {
    "Access-Control-Allow-Origin": "http://127.0.0.1:3010",
    "Vary": "Origin, Accept-Encoding",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  try {
    const body = await req.json().catch(()=> ({} as any));
    const allowSensitive = !!body?.allowSensitive;
    if (allowSensitive) {
      return NextResponse.json(
        { ok:false, error:"Sensitive/NSFW is not permitted.", policy:{ ok:false, code:"NSFW_BLOCK"} },
        { status:400, headers: cors }
      );
    }

    const duration = clamp(Number(body?.scenario?.durationSec ?? 12), 5, 60);
    const location = safeStr(body?.scenario?.location ?? "New York, Times Square");
    const style    = safeStr(body?.scenario?.style    ?? "Cinematic Vlog");
    const musicMood= safeStr(body?.creative?.musicMood?? "Energetic");
    const language = safeStr(body?.creative?.language ?? "English");
    const tier:SafetyTier = (body?.safetyTier ?? "fashion");

    const seed = seedFrom(`${location}|${style}|${musicMood}|${language}|${tier}|${duration}`);

    const hooks = [
      `POV: You in ${location} — but make it ${style}.`,
      `I took a selfie… then teleported to ${location}. Watch till the end!`,
      `${location} in ${duration}s — AI magic + ${musicMood} vibes.`,
      `From mirror selfie to ${location} — can you spot the cut?`,
    ];
    const onText = ["Selfie → Scene Match","Motion Track Face","Dynamic Light Wrap","Beat Drop Transition","Signature Outro"];
    const captions = [
      `First time trying AI location swap in ${location}. ${style} mode ON. What next city?`,
      `Testing ${musicMood} edits with my selfie — ${location} never looked this close!`,
      `${duration}s challenge: capture ${location} mood with one selfie. Rate my cut!`,
    ];
    const tagPacks = {
      broad: ["#bites","#ai","#video","#creator","#trending"],
      niche: ["#aiVFX","#virtuallocation","#cinematic","#musicedit"],
      geo:   [`#${location.toLowerCase().replace(/[^a-z0-9]+/g,"")}`,"#travel","#cityvibes"]
    };
    const hashtags = [
      ...pick(tagPacks.broad,3,seed),
      ...pick(tagPacks.niche,3,seed+1),
      ...pick(tagPacks.geo,  2,seed+2),
    ];

    const beatPool: ShotPlanItem[] = [
      { label:"Intro Selfie", desc:"Hold-selfie, quick push-in", durationSec:2, lens:"24mm", motion:"push-in" },
      { label:"Face Track", desc:"AI face track + light wrap", durationSec:3, lens:"35mm", motion:"track" },
      { label:"Location Reveal", desc:`Hard cut to ${location} BG`, durationSec:3, lens:"24mm", motion:"pan" },
      { label:"B-roll Move", desc:"Parallax sidewalk passers", durationSec:2, lens:"35mm", motion:"parallax" },
      { label:"Beat Drop", desc:"Quick zoom + lens flare", durationSec:1, lens:"50mm", motion:"snap-zoom" },
      { label:"Outro", desc:"Logo sting + tag splash", durationSec:1, lens:"35mm", motion:"outro-sting" },
    ];
    const shots: ShotPlanItem[] = [];
    let total = 0;
    for (const s of beatPool){ if (total + s.durationSec <= duration){ shots.push(s); total += s.durationSec; } else break; }
    if (total < duration){ shots.push({ label:"Hold", desc:"Hold last frame + music tail", durationSec: Math.max(1, duration-total), lens:"35mm", motion:"hold" }); }

    const sfx = pick(["whoosh-fast","camera-shutter","bass-drop-soft","vinyl-crackle","city-ambience-soft"], 2, seed+3);
    const music = `${musicMood} • 120–128 BPM • short-form safe`;
    const effects = pick(["Light Wrap (subtle)","Glow Highlights","Film Grain (low)","Chromatic Aberration (edges)","Motion Blur (cut-only)",`${style} LUT`], 3, seed+4);
    const altText = `A ${style.toLowerCase()} short featuring a selfie-based subject composited into ${location}, with dynamic motion and ${musicMood.toLowerCase()} soundtrack.`;
    const times = ["11:00","14:00","19:00"];
    const policyMessage =
      tier==="clean" ? "Policy OK — Clean content."
      : tier==="fashion" ? "Policy OK — Fashion/beauty allowed. Avoid sheer/explicit visuals."
      : "Policy OK — Spicy-Safe. No nudity, no explicit/sexual acts, no minors, comply with regional rules.";

    return NextResponse.json({
      ok: true,
      meta: {
        seed,
        received: {
          location, style, durationSec: duration,
          selfieMeta: body?.selfieMeta ?? null,
          safetyTier: tier, language, musicMood
        }
      },
      creative: {
        hook: pick(hooks,1,seed)[0],
        onScreenText: pick(onText,4,seed+5),
        caption: pick(captions,1,seed+6)[0],
        hashtags,
        altText,
      },
      audio: { music, sfx },
      video: { effects, shots },
      optimization: { optimalTimes: times, hints: ["Keep under 15s","Hook in first 0.8s","Use 3–5 hashtags"] },
      policy: { ok:true, message: policyMessage }
    }, { headers: cors });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message || "unknown" }, { status:500, headers: cors });
  }
}
