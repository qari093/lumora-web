#!/usr/bin/env node
// Project Lumora — 100K Videos Creation Engine (FFmpeg batcher)
// Usage: node scripts/video/zen-engine.mjs --manifest=data/video/manifest.jsonl --concurrency=4
import fs from "fs";
import { spawn } from "child_process";
import path from "path";

const args = Object.fromEntries(process.argv.slice(2).map(a=>{const [k,...r]=a.replace(/^--/,'').split("=");return [k,r.join("=")||true]}));
const manifestPath = args.manifest || "data/video/manifest.jsonl";
const concurrency = Number(args.concurrency || 2);
const dry = !!args.dry;

function escDrawText(s=""){ // escape for drawtext
  return (s||"").replace(/:/g,'\\:').replace(/'/g,"\\'").replace(/%/g,'\\%');
}
function ensureDir(p){fs.mkdirSync(p,{recursive:true});}
function exists(p){try{fs.accessSync(p);return true;}catch{return false}}

function buildFFmpegCmd(job){
  const w = job.w || 1080;
  const h = job.h || 1920;
  const dur = job.dur || 10;
  const fps = job.fps || 30;
  const out = job.out || `outputs/video/${(Date.now())}.mp4`;
  ensureDir(path.dirname(out));
  const inputs = [];
  const filters = [];
  const maps = [];
  let vf = [];

  // Background source: image or solid color
  if (job.bgImage) {
    inputs.push("-loop","1","-t",String(dur),"-i",job.bgImage);
    vf.push(`scale=${w}:${h}:force_original_aspect_ratio=cover`);
  } else {
    inputs.push("-f","lavfi","-t",String(dur),"-i",`color=${job.bgColor||"black"}:s=${w}x${h}`);
  }

  // Text overlay (centered by default)
  if (job.text) {
    const font = job.font || "/System/Library/Fonts/Supplemental/Arial Unicode.ttf";
    const font2 = "/Library/Fonts/Arial.ttf";
    const fontfile = exists(font) ? font : (exists(font2) ? font2 : "/System/Library/Fonts/Supplemental/Helvetica.ttc");
    const fsiz = job.fontsize || 64;
    const tcol = job.color || "white";
    const box = job.box ? ":box=1:boxcolor=black@0.4:boxborderw=10" : "";
    const x = job.tx || "(w-text_w)/2";
    const y = job.ty || "(h-text_h)/2";
    vf.push(`drawtext=fontfile='${fontfile}':text='${escDrawText(job.text)}':fontsize=${fsiz}:fontcolor=${tcol}:x=${x}:y=${y}${box}`);
  }

  // Compose vf filter
  if (vf.length) filters.push(vf.join(","));

  // Music (optional)
  const af = [];
  if (job.music) {
    inputs.push("-stream_loop","-1","-i",job.music);
    maps.push("-map","0:v:0","-map","1:a:0");
    if (job.volume) af.push(`volume=${job.volume}`);
    af.push(`atrim=0:${dur}`,`asetpts=N/SR/TB`);
  } else {
    maps.push("-map","0:v:0");
  }

  const outArgs = [
    "-r", String(fps),
    "-pix_fmt","yuv420p",
    "-t", String(dur),
    "-shortest",
    ...(filters.length? ["-vf", filters.join(",")] : []),
    ...(af.length? ["-af", af.join(",")] : []),
    ...maps,
    "-y", out
  ];

  return { inputs, outArgs, out };
}

function run(cmd,args){return new Promise((res,rej)=>{
  const p = spawn(cmd,args,{stdio:["ignore","pipe","pipe"]});
  let err = ""; p.stderr.on("data",d=>{err+=d.toString()});
  p.on("close",code=> code===0 ? res(0) : rej(new Error(err||`ffmpeg exit ${code}`)));
});}

function hasFFmpeg(){try{spawn("ffmpeg",["-version"]);return true}catch{return false}}

async function main(){
  if (!hasFFmpeg()) { console.error("❌ ffmpeg not found. Install with: brew install ffmpeg"); process.exit(2); }
  if (!exists(manifestPath)) { console.error("❌ manifest not found:", manifestPath); process.exit(2); }
  const rl = fs.readFileSync(manifestPath,"utf8").split(/\r?\n/).filter(Boolean);
  const jobs = rl.map((line,i)=>{try{return JSON.parse(line)}catch(e){throw new Error(`Bad JSONL at line ${i+1}: ${e.message}`)}});
  console.log(`🔧 Loaded ${jobs.length} jobs | concurrency=${concurrency} | dry=${dry}`);

  let idx = 0, active = 0, done=0, failed=0;
  const next = async ()=>{
    if (idx>=jobs.length) return;
    const j = jobs[idx++]; active++;
    try{
      const {inputs,outArgs,out} = buildFFmpegCmd(j);
      const args = [...inputs, ...outArgs];
      console.log(`▶️  ${out}`);
      if (!dry) await run("ffmpeg", args);
      console.log(`✅ ${out}`); done++;
    }catch(e){
      console.error(`❌ Job failed: ${e.message}`); failed++;
    }finally{
      active--; if (idx<jobs.length) next();
    }
  };

  const starters = Math.min(concurrency, jobs.length);
  for (let i=0;i<starters;i++) next();

  // wait loop
  await new Promise(r=>{
    const iv=setInterval(()=>{
      if (done+failed===jobs.length && active===0){clearInterval(iv);r(null);}
    },200);
  });
  console.log(`\n🏁 Completed: ${done} OK, ${failed} failed`);
}
main().catch(e=>{console.error("ENGINE ERROR:",e);process.exit(1)});
