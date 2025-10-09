import fs from "fs";
import path from "path";
import type { GenJob, GenRequest, GenStatus } from "./types";
import { detectLanguage, defaultVoice, captionStyle, translate } from "./i18n";
import { makeFusion, scriptPrompt, brollPrompt } from "./prompts";

// ---------- utilities ----------
const sleep = (ms:number)=>new Promise(r=>setTimeout(r,ms));
const id = ()=>Math.random().toString(36).slice(2);
const ensureDir = (p:string)=>{ fs.mkdirSync(p, { recursive: true }); return p; };

// Keep paths consistent with worker
const DATA_DIR   = ensureDir(path.join(process.cwd(), ".data", "render"));
const CACHE_DIR  = ensureDir(path.join(DATA_DIR, "cache"));
const OUT_DIR    = ensureDir(path.join(process.cwd(), "out", "videos"));

// ---------- Viral Catch & Loop heuristics ----------
function reinforceViralBeats(lines: {t:number;text:string}[], plan: GenJob["plan"]) {
  if (!lines.length) return lines;
  // 1) strong hook in first 1.5s
  if (lines[0].t > 0.0) lines.unshift({ t: 0.0, text: plan.hook });
  else lines[0].text = withCue(lines[0].text, "[ZOOM][CUT] " + plan.hook);

  // 2) micro-beats about every ~2.2s
  const beats = ["[CUT]","[ZOOM]","[SFX]","[FLASH]","[JUMP]"];
  const withBeats: {t:number;text:string}[] = [];
  let lastBeat = 0;
  for (const ln of lines) {
    if (ln.t - lastBeat >= 2.2) {
      lastBeat = ln.t;
      withBeats.push({ t: ln.t, text: withCue(ln.text, beats[Math.floor(Math.random()*beats.length)]) });
    } else {
      withBeats.push(ln);
    }
  }

  // 3) retention/CTA tail
  const tailT = (withBeats.at(-1)?.t ?? 7) + 2.0;
  const tailChoices = [
    plan.cta ?? "Save & share",
    "Comment your favorite part!",
    "Tag a friend who needs this",
    "Follow for Part 2 →",
  ];
  withBeats.push({ t: tailT, text: tailChoices[Math.floor(Math.random()*tailChoices.length)] });

  return dedupeTimeline(withBeats);
}

function withCue(text: string, cue: string) {
  if (text.includes("[") && text.includes("]")) return text;
  return `${cue} ${text}`.trim();
}

function dedupeTimeline(lines: {t:number;text:string}[]) {
  const sorted = [...lines].sort((a,b)=>a.t-b.t);
  const out: {t:number;text:string}[] = [];
  for (const ln of sorted) {
    const last = out.at(-1);
    if (last && Math.abs(last.t - ln.t) < 0.05) last.text = last.text + " " + ln.text;
    else out.push(ln);
  }
  return out;
}

// ---------- Engine ----------
export class VideoEngine {
  private jobs = new Map<string, GenJob>();

  createJob(req: GenRequest): GenJob {
    const lang = req.language ?? detectLanguage(req.prompt);
    const plan = makeFusion({ ...req, language: lang });

    const job: GenJob = {
      id: id(),
      req,
      lang,
      plan,
      script: { lines: [], brollCues: [], sfxCues: [], musicCue: undefined },
      assets: { clips: [], font: undefined, musicPath: undefined, voicePath: undefined, subtitlesSrt: undefined, hashtags: plan.hashtags },
      status: "queued",
      outPath: undefined,
      error: undefined,
    };

    this.jobs.set(job.id, job);
    void this.run(job.id);
    return job;
  }

  get(id: string) { return this.jobs.get(id); }

  private async run(jobId: string) {
    const job = this.jobs.get(jobId);
    if (!job) return;
    try {
      // 1) Scripting
      await this.step(job, "scripting", async () => {
        const _sp = scriptPrompt(job.plan, job.req.prompt || "", job.lang);
        // stub lines (replace with LLM JSON)
        let lines = [
          { t: 0.0, text: job.plan.hook },
          { t: 1.1, text: "Fact #1: a quick surprising truth. [CUT]" },
          { t: 3.3, text: "Fact #2: even wilder than #1. [SFX]" },
          { t: 5.5, text: "Fact #3: the twist nobody expects. [ZOOM]" },
          { t: 7.6, text: job.plan.cta ?? "Save & share" },
        ];
        lines = reinforceViralBeats(lines, job.plan);

        if (job.req.language && job.req.language !== job.lang) {
          const translated = [];
          for (const l of lines) translated.push({ t: l.t, text: await translate(l.text, job.req.language) });
          lines = translated;
          job.lang = job.req.language;
        }
        job.script.lines = lines;

        // 2) B-roll cues (stub)
        job.script.brollCues = [
          "macro water pour","kinetic sand cut","colorful powders burst",
          "close-up hands assembling","clean desk swipe","light leaks over texture"
        ];
      });

      // 2) Assembling: captions, voice/music placeholders, font
      await this.step(job, "assembling", async () => {
        const style = captionStyle(job.lang);
        job.assets.subtitlesSrt = this.toSrt(job.script.lines, { rtl: style.rtl });

        job.assets.font = style.font;
        job.assets.musicPath = path.join(CACHE_DIR, "music-trend-placeholder.mp3");
        job.assets.voicePath = path.join(CACHE_DIR, `voice-${job.id}.wav`);
        safeTouch(job.assets.musicPath!);
        safeTouch(job.assets.voicePath!);
      });

      // 3) Rendering handoff: write a render plan JSON for the worker
      await this.step(job, "rendering", async () => {
        const planPath = path.join(DATA_DIR, `renderPlan-${job.id}.json`);
        const outPath = path.join(OUT_DIR, `${job.id}.mp4`);
        const aspect = job.req.aspect ?? "9:16";
        const { width, height } = pickSize(aspect);

        const renderPlan = {
          id: job.id,
          outPath,
          fps: 30,
          size: { width, height, aspect },
          audio: {
            voice: job.assets.voicePath,
            music: job.assets.musicPath,
            musicDucking: autoDuckFromScript(job.script.lines),
          },
          subtitles: {
            srt: job.assets.subtitlesSrt,
            rtl: captionStyle(job.lang).rtl,
            font: job.assets.font,
            style: {
              sizePct: captionStyle(job.lang).sizePct,
              outlinePx: captionStyle(job.lang).outlinePx,
              bottomPct: captionStyle(job.lang).bottomPct,
            },
          },
          timeline: {
            clips: buildClipTimeline(job.script.lines, job.script.brollCues, width, height),
            transitions: autoTransitions(job.script.lines),
            lut: pickLUT(job.plan),
          },
          meta: {
            plan: job.plan,
            lang: job.lang,
            hashtags: job.assets.hashtags,
            createdAt: new Date().toISOString(),
          },
        };

        fs.writeFileSync(planPath, JSON.stringify(renderPlan, null, 2), "utf8");
        job.outPath = outPath; // finalized by worker
      });

      // Leave as "rendering" until worker completes.
      this.jobs.set(jobId, job);

    } catch (e: any) {
      job.status = "failed";
      job.error = String(e?.message ?? e);
      this.jobs.set(jobId, job);
    }
  }

  private async step(job: GenJob, status: GenStatus, fn: ()=>Promise<void>) {
    job.status = status;
    this.jobs.set(job.id, job);
    await fn();
  }

  private toSrt(lines: {t:number;text:string}[], s:{rtl:boolean}) {
    let out = "";
    for (let i=0; i<lines.length; i++){
      const a = lines[i];
      const b = lines[i+1] ?? { t: a.t + 1.6, text: "" };
      const ts = (n:number)=>{
        const ms = Math.round(n*1000);
        const hh = String(Math.floor(ms/3600000)).padStart(2,"0");
        const mm = String(Math.floor((ms%3600000)/60000)).padStart(2,"0");
        const ss = String(Math.floor((ms%60000)/1000)).padStart(2,"0");
        const mmm = String(ms%1000).padStart(3,"0");
        return `${hh}:${mm}:${ss},${mmm}`;
      };
      const txt = s.rtl ? `\u202B${a.text}\u202C` : a.text;
      out += `${i+1}\n${ts(a.t)} --> ${ts(b.t)}\n${txt}\n\n`;
    }
    return out;
  }
}

// ---------- helpers for render plan ----------
function pickSize(aspect: "9:16"|"1:1"|"16:9") {
  if (aspect === "9:16")  return { width: 1080, height: 1920 };
  if (aspect === "1:1")   return { width: 1080, height: 1080 };
  return { width: 1920, height: 1080 };
}

function safeTouch(p:string) {
  try { fs.mkdirSync(path.dirname(p), { recursive: true }); } catch {}
  if (!fs.existsSync(p)) fs.writeFileSync(p, Buffer.alloc(0));
}

function autoDuckFromScript(lines:{t:number;text:string}[]) {
  return lines.map(l => ({ start: Math.max(0,l.t-0.05), end: l.t + 1.6, gainDb: -10 }));
}

function buildClipTimeline(
  lines:{t:number;text:string}[],
  cues:string[],
  width:number,
  height:number
) {
  const clips:any[] = [];
  for (let i=0;i<lines.length;i++){
    const a = lines[i], b = lines[i+1] ?? { t:a.t+1.7, text:"" };
    const cue = cues[i % Math.max(1,cues.length)] ?? "texture light";
    clips.push({
      kind: "broll",
      source: `stock:${cue}`,
      in: 0.0,
      out: Math.max(0.6, b.t - a.t),
      at: a.t,
      fit: "cover",
      size: { width, height }
    });
  }
  return clips;
}

function autoTransitions(lines:{t:number;text:string}[]) {
  const tx:any[] = [];
  for (let i=1;i<lines.length;i++){
    const d = lines[i].t - lines[i-1].t;
    tx.push({
      at: Math.max(0, lines[i].t - 0.05),
      type: d < 2.0 ? "whip" : "crossfade",
      dur: d < 2.0 ? 0.08 : 0.18
    });
  }
  return tx;
}

function pickLUT(plan: GenJob["plan"]) {
  if (plan.primary === "visual_spectacle") return "vibrant_punch";
  if (plan.primary === "asmr_satisfying")  return "soft_pastel";
  if (plan.primary === "transformations")  return "clean_true_to_life";
  return "neutral_pop";
}

// ---------- singleton ----------
export const videoEngine = new VideoEngine();
