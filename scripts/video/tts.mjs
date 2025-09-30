import { run } from "./_utils.mjs";
import { pickVoice } from "./lang.mjs";
export async function synthTTS(text, lang, outMp3){
  const aiff = outMp3.replace(/\.mp3$/i,".aiff");
  const voice = pickVoice(lang);
  try { await run("say",["-v",voice,"-o",aiff,"--data-format=LEF32@22050",text]); }
  catch { await run("say",["-v","Samantha","-o",aiff,"--data-format=LEF32@22050",text]); }
  await run("ffmpeg",["-y","-i",aiff,"-ar","44100","-ac","2",outMp3]);
  return outMp3;
}
