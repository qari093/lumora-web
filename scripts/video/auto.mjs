#!/usr/bin/env node
import { loadTrends } from "./trends.mjs";
import { writeScript } from "./script-writer.mjs";
import { synth } from "./tts.mjs";
import { render } from "./render.mjs";
import { publish } from "./post.mjs";
import { ensureDir, hasFFmpeg, safeName } from "./_utils.mjs";

const args = Object.fromEntries(process.argv.slice(2).map(a=>{const [k,...r]=a.replace(/^--/,'').split("=");return [k,r.join("=")||true]}));
const COUNT = Number(args.count||10);
const CONC = Number(args.concurrency||2);
const DUR_MIN = Number(args.min||8);
const DUR_MAX = Number(args.max||45);

if (!hasFFmpeg()){
  console.error("❌ ffmpeg not found. Install with: brew install ffmpeg");
  process.exit(2);
}

const topics = loadTrends(COUNT);

// helpers
const rand = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick = (arr)=>arr[rand(0,arr.length-1)];
const BGs = ["#0b1020","#111122","#1b2836","#101820","#202a44","#0d0f1a","#1a1f2e","#222233"];
const FPS = [24,25,30];

console.log(`🌀 Generating ${topics.length} videos | conc=${CONC} | durations ${DUR_MIN}-${DUR_MAX}s`);

let idx=0, active=0, ok=0, fail=0;
const next = async ()=>{
  if (idx>=topics.length) return;
  const topic = topics[idx++]; active++;
  try{
    // per-video randomness
    const dur = rand(DUR_MIN, DUR_MAX);
    const fps = pick(FPS);
    const bg  = pick(BGs);

    const script = writeScript(topic);
    const slug = safeName(`${topic.title}-${topic.lang||"en"}-${dur}s`);
    const mp3  = `outputs/video/${slug}.mp3`;
    const mp4  = `outputs/video/${slug}.mp4`;

    await synth(script, topic.lang||"en", mp3);
    await render({ text: topic.title, mp3, out: mp4, dur, fps, bg });
    publish(mp4, { title: topic.title, lang: topic.lang, niche: topic.niche });

    ok++; console.log(`✅ ${slug}`);
  }catch(e){
    fail++; console.error("❌", e.message);
  }finally{
    active--; if (idx<topics.length) next();
  }
};

const starters = Math.min(CONC, topics.length);
for (let i=0;i<starters;i++) next();

const wait = ()=>new Promise(r=>setTimeout(r,200));
(async()=>{ while (ok+fail < topics.length) await wait(); console.log(`\n🏁 Done: ${ok} ok, ${fail} failed`); })();
