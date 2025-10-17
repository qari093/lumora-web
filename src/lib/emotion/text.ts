export type EmotionLabel = "joy" | "surprise" | "neutral" | "sadness" | "anger" | "fear" | "disgust";
export type SentimentLabel = "positive" | "neutral" | "negative";

const LEX = {
  joy: ["happy","joy","great","love","awesome","excellent","amazing","fantastic","wonderful","good","nice","cool","win","thanks","grateful"],
  surprise: ["wow","surprised","unexpected","shocked","unbelievable","no way","suddenly","omg","what?!"],
  sadness: ["sad","unhappy","depressed","down","cry","tears","hurt","broken","lonely","miss","sorry"],
  anger: ["angry","mad","furious","hate","annoyed","rage","wtf","stupid","idiot","trash"],
  fear: ["scared","afraid","fear","nervous","anxious","worry","panic","terrified"],
  disgust: ["disgust","gross","nasty","ew","cringe","yuck","disgusting","vomit"]
};

const POS = new Set([...LEX.joy,"progress","improve","success","win","wins","love","liked","like","beautiful","great"]);
const NEG = new Set([...LEX.sadness,...LEX.anger,...LEX.fear,...LEX.disgust,"fail","failed","failure","bad","worse","worst","bug","broken"]);

function tokenize(s:string){ return s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu," ").split(/\s+/).filter(Boolean); }

export function analyzeText(text:string){
  const toks = tokenize(text||"");
  const counts: Record<EmotionLabel, number> = { joy:0,surprise:0,neutral:0,sadness:0,anger:0,fear:0,disgust:0 };
  for(const [label, words] of Object.entries(LEX) as [EmotionLabel,string[]][]) {
    for(const w of toks) if(words.includes(w)) counts[label] += 1;
  }
  // sentiment score
  let score = 0;
  for(const w of toks){ if(POS.has(w)) score += 1; if(NEG.has(w)) score -= 1; }
  const sentiment: SentimentLabel = score>0 ? "positive" : score<0 ? "negative" : "neutral";

  // dominant emotion
  let dom: EmotionLabel = "neutral"; let max = 0;
  (Object.keys(counts) as EmotionLabel[]).forEach(k => { if(counts[k]>max){ max=counts[k]; dom=k; } });
  if(max===0) dom = "neutral";

  // soft distribution (normalize)
  const total = Object.values(counts).reduce((a,b)=>a+b,0) || 1;
  const distribution = Object.fromEntries((Object.entries(counts) as [EmotionLabel,number][])
     .map(([k,v])=>[k, Number((v/total).toFixed(3))]));

  const confidence = Math.min(0.95, 0.55 + Math.min(0.4, total*0.05));
  return { sentiment, score, emotion: dom, confidence, distribution, tokens: toks.length };
}
\TS

# 2) Stubs for audio/video (extend later)
cat > src/lib/emotion/index.ts <<TS
import { analyzeText } from "./text";
export type Mode = "text" | "audio" | "video";

export async function analyze(payload: { mode?: Mode; text?: string; lang?: string; audioUrl?: string; videoUrl?: string; }) {
  const mode = payload.mode || (payload.text ? "text" : "text");
  if(mode==="text"){
    const r = analyzeText(payload.text||"");
    return { mode, ...r };
  }
  if(mode==="audio"){
    // TODO: add whisper/transcript → analyzeText
    return { mode, todo: "audio-transcription", sentiment:"neutral", score:0, emotion:"neutral", confidence:0.5, distribution:{neutral:1} };
  }
  if(mode==="video"){
    // TODO: add VAD/affect cues → analyzeText of captions
    return { mode, todo: "video-affect", sentiment:"neutral", score:0, emotion:"neutral", confidence:0.5, distribution:{neutral:1} };
  }
  return { mode:"text", ...analyzeText(payload.text||"") };
}
\TS

# 3) API route: /api/emotion/analyze (edge-friendly)
mkdir -p src/app/api/emotion/analyze
cat > src/app/api/emotion/analyze/route.ts <<TS
import { NextRequest, NextResponse } from "next/server";
import { analyze } from "@/lib/emotion";

export const runtime = "edge";

export async function POST(req: NextRequest){
  try{
    const body = await req.json().catch(()=> ({}));
    const mode = (body?.mode||"text") as "text"|"audio"|"video";
    const text = String(body?.text||"");
    const lang = typeof body?.lang==="string" ? body.lang : undefined;
    const out = await analyze({ mode, text, lang, audioUrl: body?.audioUrl, videoUrl: body?.videoUrl });
    return NextResponse.json({ ok:true, ...out }, { headers: { "Cache-Control":"no-store" } });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: String(e?.message||e) }, { status: 400 });
  }
}

export async function GET(){
  return NextResponse.json({ ok:true, ping:"/api/emotion/analyze", usage:"POST {mode:text, text:your
