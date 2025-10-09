import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { join } from "path";
import { nanoid } from "nanoid";
import { buildDrawtextFilter, Cue } from "./subtitles";

// FFMPEG_PATH_GUARD
const _p = (ffmpegPath as unknown as string) || process.env.FFMPEG_PATH || "";
if (_p) { try { ffmpeg.setFfmpegPath(_p as string); } catch {} }

export type Scene = { bgColor?: string; imageUrl?: string; videoUrl?: string; text?: string; duration?: number; };
export type ComposeSpec = {
  width: number; height: number;
  scenes: Scene[];
  musicUrl?: string;
  voiceoverPath?: string;
  captions?: Cue[];
  outPath?: string;
  safeBottom?: number;
};

export async function composeShort(spec: ComposeSpec): Promise<string> {
  const out = spec.outPath || join("/tmp", `vid_${nanoid()}.mp4`);
  const args:string[] = [];
  const filters:string[] = [];
  let idx = 0;
  const parts:number[] = [];

  for (const sc of spec.scenes) {
    const dur = sc.duration ?? 3;
    if (sc.videoUrl) {
      args.push("-stream_loop","-1","-t",String(dur),"-i", sc.videoUrl);
      filters.push(`[${idx}:v]scale=${spec.width}:${spec.height}:force_original_aspect_ratio=cover,trim=duration=${dur},setpts=PTS-STARTPTS[v${idx}]`);
    } else if (sc.imageUrl) {
      args.push("-loop","1","-t",String(dur),"-i", sc.imageUrl);
      filters.push(`[${idx}:v]scale=${spec.width}:${spec.height}:force_original_aspect_ratio=cover,trim=duration=${dur},setpts=PTS-STARTPTS[v${idx}]`);
    } else {
      args.push("-f","lavfi","-t",String(dur),"-i",`color=c=${(sc.bgColor||"black")}:s=${spec.width}x${spec.height}`);
      filters.push(`[${idx}:v]trim=duration=${dur},setpts=PTS-STARTPTS[v${idx}]`);
    }
    parts.push(idx); idx++;
  }

  const concatInputs = parts.map(i=>`[v${i}]`).join("");
  filters.push(`${concatInputs}concat=n=${parts.length}:v=1:a=0[basev]`);

  let vf = "[basev]";
  if (spec.captions?.length) {
    const draw = buildDrawtextFilter(spec.captions, spec.width, spec.safeBottom||140);
    filters.push(`${vf}${draw?","+draw:""}[vout]`);
    vf = "[vout]";
  }

  const cmd = ffmpeg();
  cmd.inputOptions(args);

  if (spec.musicUrl) cmd.input(spec.musicUrl);
  if (spec.voiceoverPath) cmd.input(spec.voiceoverPath);

  cmd.complexFilter(filters, [vf.slice(1,-1)]);

  let outArgs = ["-map", vf, "-c:v","libx264","-pix_fmt","yuv420p","-preset","veryfast","-crf","23","-r","30","-movflags","+faststart"];
  if (spec.musicUrl || spec.voiceoverPath) outArgs = outArgs.concat(["-shortest","-c:a","aac","-b:a","160k"]);

  await new Promise<void>((resolve,reject)=>{
    cmd.outputOptions(outArgs).save(out).on("end", ()=>resolve()).on("error", reject);
  });
  if (!fs.existsSync(out)) throw new Error("compose failed");
  return out;
}
