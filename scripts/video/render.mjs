import fs from "fs";
import path from "path";
import { ensureDir, run } from "./_utils.mjs";

function esc(s){ return String(s).replace(/:/g,'\\:').replace(/'/g,"\\'"); }

export function buildArgs({ w=1080,h=1920,fps=30,dur=12,bg="#0b1020",text="",stamp="",mp3=null,out, debugFile=null }){
  const args=["-hide_banner","-loglevel","error"];

  // Inputs (video first)
  args.push("-f","lavfi","-t",String(dur),"-i",`color=${bg}:s=${w}x${h}:r=${fps}`); // 0:v
  const hasMp3 = mp3 && fs.existsSync(mp3);
  if (hasMp3){ args.push("-i", mp3); } // 1:a

  // Filters
  const font="/System/Library/Fonts/Supplemental/Arial Unicode.ttf";
  const filters=[];
  if (text){
    filters.push(
      `drawtext=fontfile='${font}':text='${esc(text)}':fontsize=54:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:box=1:boxcolor=black@0.4:boxborderw=12:line_spacing=8`
    );
  }
  if (stamp){
    filters.push(
      `drawtext=fontfile='${font}':text='${esc(stamp)}':fontsize=28:fontcolor=white:x=w-tw-20:y=h-th-20:box=1:boxcolor=black@0.45:boxborderw=8`
    );
  }
  if (filters.length) args.push("-vf", filters.join(","));

  // Maps
  args.push("-map","0:v:0");
  if (hasMp3) args.push("-map","1:a:0");

  // Duration / codecs
  args.push("-shortest","-t",String(dur));
  args.push("-c:v","libx264","-preset","veryfast","-crf","22","-r",String(fps),"-pix_fmt","yuv420p");
  if (hasMp3) args.push("-c:a","aac","-b:a","192k");

  // Output
  args.push("-y", out);

  // Debug dump
  if (debugFile){
    try {
      fs.writeFileSync(debugFile, args.map(a => (/\s/.test(a)?`"${a}"`:a)).join(" "));
    } catch {}
  }
  return args;
}

export async function render(opts){
  ensureDir(path.dirname(opts.out));
  const dbg = `outputs/video/ffmpeg-debug-${Date.now()}.txt`;
  const args = buildArgs({ ...opts, debugFile: dbg });
  await run("ffmpeg", args);
  return opts.out;
}
