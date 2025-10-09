// FFmpeg worker (ESM-safe). Reads a render plan JSON and renders MP4.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

type Clip = {
  file: string;
  start?: number;
  end?: number;
  fit?: "cover" | "contain";
  speed?: number;
};
type Transition = { at: number; type: "crossfade" | "whip"; dur: number };
type Plan = {
  outPath: string;
  width: number;
  height: number;
  fps: number;
  bgColor?: string;
  color?: { saturation?: number };
  clips: Clip[];
  transitions?: Transition[];
  voice?: { file: string; gainDb?: number };
  music?: { file: string; gainDb?: number; duck?: { amountDb?: number } };
  subtitles?: { srtPath: string; font?: string; outlinePx?: number; bottomPct?: number };
};

function sh(cmd: string, args: string[]) {
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`${cmd} failed (exit ${r.status})`);
}
function escapeFF(s: string) { return s.replace(/:/g,"\\:").replace(/,/g,"\\,"); }

function buildVideoFilters(plan: Plan, clipInputIdx: number[]) {
  const w = plan.width, h = plan.height, fps = plan.fps;
  const bgHex = (plan.bgColor ?? "#000000").replace("#", "0x");
  const sat = plan.color?.saturation ?? 1.0;

  const parts: string[] = [];
  const labels: string[] = [];

  clipInputIdx.forEach((idx, i) => {
    const c = plan.clips[i];
    const doTrim = typeof c.start === "number" || typeof c.end === "number";
    const trim = doTrim
      ? `trim=${typeof c.start==="number"?`start=${c.start}`:""}:${typeof c.end==="number"?`end=${c.end}`:""},setpts=PTS-STARTPTS`
      : `setpts=PTS-STARTPTS`;
    const speed = c.speed && c.speed !== 1 ? `,setpts=PTS/${c.speed}` : "";
    const vfFit = c.fit === "contain"
      ? `scale=${w}:-2:flags=lanczos,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2:${bgHex}`
      : `scale=${w}:-2:flags=lanczos,crop=${w}:${h}`;
    parts.push(`[${idx}:v]${trim}${speed},fps=${fps},format=yuv420p,${vfFit},eq=saturation=${sat}[v${i}]`);
    labels.push(`v${i}`);
  });

  let vOut = "vout";
  if (labels.length === 1) {
    parts.push(`[${labels[0]}]fps=${fps},format=yuv420p[${vOut}]`);
  } else if (labels.length > 1) {
    const chain = labels.map(l=>`[${l}]`).join("");
    parts.push(`${chain}concat=n=${labels.length}:v=1:a=0,format=yuv420p[${vOut}]`);
  } else {
    parts.push(`color=c=${bgHex}:size=${w}x${h}:rate=${fps}[${vOut}]`);
  }
  return { filter: parts.join(";"), videoLabel: vOut };
}
function dbToLin(db: number) { return Math.pow(10, db/20); }

function buildAudioFilters(plan: Plan, firstAudioIndex: number) {
  const parts: string[] = [];
  const inputs: string[] = [];
  let aOut = "aout";
  let idx = firstAudioIndex;

  if (plan.voice?.file && fs.existsSync(plan.voice.file)) {
    const g = dbToLin(plan.voice.gainDb ?? 1);
    parts.push(`[${idx}:a]aformat=sample_fmts=s16:channel_layouts=stereo,aresample=48000,volume=${g.toFixed(3)}[v]`);
    inputs.push("v");
    idx++;
  }
  if (plan.music?.file && fs.existsSync(plan.music.file)) {
    const g = dbToLin(plan.music.gainDb ?? -8);
    parts.push(`[${idx}:a]aformat=sample_fmts=s16:channel_layouts=stereo,aresample=48000,volume=${g.toFixed(3)}[m0]`);
    parts.push(`[m0]anull[m]`);
    inputs.push("m");
    idx++;
  }

  if (inputs.length === 0) {
    parts.push(`anullsrc=r=48000:cl=stereo[${aOut}]`);
  } else if (inputs.length === 1) {
    parts.push(`[${inputs[0]}]aresample=async=1:first_pts=0[${aOut}]`);
  } else {
    parts.push(`[${inputs[0]}][${inputs[1]}]amix=inputs=2:normalize=0,aresample=async=1:first_pts=0[${aOut}]`);
  }
  return { filter: parts.join(";"), audioLabel: aOut, nextIdx: idx };
}

export async function render(planPath: string, _opts?: { jobId?: string }) {
  if (!planPath || typeof planPath !== "string") {
    throw new Error("render(planPath) requires a valid string path");
  }
  if (!fs.existsSync(planPath)) {
    throw new Error(`Plan not found: ${planPath}`);
  }

  // Read and normalize plan
  const raw = fs.readFileSync(planPath, "utf8");
  let plan = {} as Partial<Plan>;
  try { plan = JSON.parse(raw); } catch { plan = {}; }

  // Safe defaults
  const outPath = String((plan as any).outPath || "out/videos/from-api-ducked.mp4");
  const width   = Number.isFinite((plan as any).width)  ? Number((plan as any).width)  : 1080;
  const height  = Number.isFinite((plan as any).height) ? Number((plan as any).height) : 1920;
  const fps     = Number.isFinite((plan as any).fps)    ? Number((plan as any).fps)    : 30;

  const normPlan: Plan = {
    outPath,
    width,
    height,
    fps,
    bgColor: (plan as any).bgColor ?? "#000000",
    color: (plan as any).color ?? {},
    clips: Array.isArray((plan as any).clips) ? (plan as any).clips : [],
    transitions: Array.isArray((plan as any).transitions) ? (plan as any).transitions : [],
    voice: (plan as any).voice,
    music: (plan as any).music,
    subtitles: (plan as any).subtitles
  };

  // Ensure output directory
  fs.mkdirSync(path.dirname(normPlan.outPath), { recursive: true });

  // Build ffmpeg args
  const args: string[] = ["-y","-v","info"];

  // video inputs
  const clipInputIdx: number[] = [];
  normPlan.clips.forEach((c, i) => {
    if (!c?.file || !fs.existsSync(c.file)) throw new Error(`Clip missing: ${c?.file}`);
    args.push("-i", c.file);
    clipInputIdx.push(i);
  });

  // audio inputs
  let audioStart = clipInputIdx.length;
  if (normPlan.voice?.file && fs.existsSync(normPlan.voice.file)) args.push("-i", normPlan.voice.file);
  if (normPlan.music?.file && fs.existsSync(normPlan.music.file)) args.push("-i", normPlan.music.file);

  const vf = buildVideoFilters(normPlan, clipInputIdx);
  const af = buildAudioFilters(normPlan, audioStart);
  const filterComplex = [vf.filter, af.filter].filter(Boolean).join(";");

  args.push("-filter_complex", filterComplex);

  const vMap = vf.videoLabel && String(vf.videoLabel).length ? vf.videoLabel : "vout";
  args.push("-map", `[${vMap}]`, "-map", `[${af.audioLabel}]`);

  args.push(
    "-c:v","libx264","-profile:v","high","-pix_fmt","yuv420p",
    "-crf","18","-preset","medium","-r", String(normPlan.fps),
    "-c:a","aac","-b:a","192k",
    "-shortest", normPlan.outPath
  );

  console.log("⏺️  ffmpeg", args.join(" "));
  sh("ffmpeg", args);
  console.log("✅ Render complete:", normPlan.outPath);
}

// ESM entry for manual CLI use
const __self = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__self)) {
  const p = process.argv[2];
  if (!p) { console.error("Usage: npx tsx src/video-gen/ffmpeg-worker.ts <renderPlan.json>"); process.exit(1); }
  render(path.resolve(p)).catch(err => { console.error(err); process.exit(1); });
}
