import { execFile } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { request } from "undici";

export type TTSOpts = { text: string; lang: string; voice?: string; format?: "wav"|"mp3" };
export type TTSResult = { path: string; mime: string };

const isMac = process.platform === "darwin";

const LANG_VOICE_MAP: Record<string,string> = {
  EN: "Samantha", ES: "Monica", PT: "Luciana", FR: "Amelie", DE: "Anna",
  IT: "Alice", RU: "Milena", JA: "Kyoko", KO: "Yuna", ID: "Damayanti",
  TR: "Yelda", AR: "Maged", VI: "Linh", TH: "Kanya", HI: "Veena",
  UR: "Ava", BN: "Ava"
};

export async function tts(opts: TTSOpts): Promise<TTSResult> {
  const provider = (process.env.TTS_PROVIDER || "macos").toLowerCase();
  if (provider === "elevenlabs") return ttsElevenLabs(opts);
  if (provider === "azure") return ttsAzure(opts);
  return ttsMac(opts);
}

async function ttsMac(opts: TTSOpts): Promise<TTSResult> {
  if (!isMac) throw new Error("macOS TTS not available; set TTS_PROVIDER=elevenlabs or azure");
  const v = opts.voice || LANG_VOICE_MAP[opts.lang] || "Samantha";
  const aiff = join(tmpdir(), `vo_${Date.now()}_${Math.random().toString(36).slice(2)}.aiff`);
  const wav = aiff.replace(/\.aiff$/, ".wav");
  await new Promise<void>((resolve,reject)=>{
    execFile("say", ["-v", v, "-o", aiff, opts.text], (e)=> e?reject(e):resolve());
  });
  await new Promise<void>((resolve,reject)=>{
    execFile("afconvert", ["-f","WAVE","-d","LEI16", aiff, wav], (e)=> e?reject(e):resolve());
  });
  return { path: wav, mime: "audio/wav" };
}

async function ttsElevenLabs(opts: TTSOpts): Promise<TTSResult> {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("Missing ELEVENLABS_API_KEY");
  const voiceId = opts.voice || "21m00Tcm4TlvDq8ikWAM";
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const r = await request(url, {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json" },
    body: JSON.stringify({ text: opts.text, model_id: "eleven_multilingual_v2" })
  });
  if (r.statusCode >= 400) throw new Error("elevenlabs error");
  const buf = Buffer.from(await r.body.arrayBuffer());
  const out = join(tmpdir(), `vo_${Date.now()}.mp3`);
  await writeFile(out, buf);
  return { path: out, mime: "audio/mpeg" };
}

async function ttsAzure(opts: TTSOpts): Promise<TTSResult> {
  const key = process.env.AZURE_TTS_KEY, region = process.env.AZURE_TTS_REGION;
  if (!key || !region) throw new Error("Missing AZURE_TTS_KEY or AZURE_TTS_REGION");
  const voice = opts.voice || azureVoiceForLang(opts.lang);
  const ssml = `<speak version="1.0" xml:lang="en-US"><voice name="${voice}">${escapeXml(opts.text)}</voice></speak>`;
  const url = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
  const r = await request(url, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3"
    },
    body: ssml
  });
  if (r.statusCode >= 400) throw new Error("azure tts error");
  const buf = Buffer.from(await r.body.arrayBuffer());
  const out = join(tmpdir(), `vo_${Date.now()}.mp3`);
  await writeFile(out, buf);
  return { path: out, mime: "audio/mpeg" };
}

function azureVoiceForLang(lang:string){
  const m:Record<string,string> = {
    EN:"en-US-JennyNeural", ES:"es-ES-ElviraNeural", PT:"pt-BR-FranciscaNeural",
    FR:"fr-FR-DeniseNeural", DE:"de-DE-KatjaNeural", IT:"it-IT-ElsaNeural",
    RU:"ru-RU-SvetlanaNeural", JA:"ja-JP-NanamiNeural", KO:"ko-KR-SunHiNeural",
    ID:"id-ID-GadisNeural", TR:"tr-TR-EmelNeural", AR:"ar-SA-ZariyahNeural",
    VI:"vi-VN-HoaiMyNeural", TH:"th-TH-PremwadeeNeural", HI:"hi-IN-SwaraNeural",
    UR:"ur-PK-UzmaNeural", BN:"bn-BD-NabanitaNeural",
  };
  return m[lang] || "en-US-JennyNeural";
}

function escapeXml(s:string){
  return s.replace(/[<>&\"']/g, (c)=>({"<":"&lt;",">":"&gt;","&":"&amp;","\"":"&quot;","'":"&apos;"}[c]!));
}
