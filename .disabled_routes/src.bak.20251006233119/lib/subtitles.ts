import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath as string);

export type Cue = { start: number; end: number; text: string };

export function buildDrawtextFilter(
  cues: Cue[],
  width = 1080,
  bottom = 140,
  fontPath = process.env.FONT_PATH || "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
){
  const esc = (t:string)=>t.replace(/:/g,"\\:").replace(/'/g,"\\\'").replace(/,/g,"\\,");
  return cues.map(c=>{
    const enable = `between(t\\,${(c.start/1000).toFixed(2)}\\,${(c.end/1000).toFixed(2)})`;
    return `drawtext=fontfile='${fontPath}':text='${esc(c.text)}':x=(w-text_w)/2:y=h-${bottom}:fontsize=48:fontcolor=white:borderw=2:enable='${enable}'`;
  }).join(",");
}
