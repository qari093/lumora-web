import { analyzeText } from "@/lib/emotion/text";

type Input = {
  title?: string;
  caption?: string;
  durationSec?: number;
  tags?: string[];
  hourLocal?: number;
};

export type ScoreOut = {
  score: number;
  grade: "S"|"A"|"B"|"C"|"D";
  reasons: string[];
  sentiment?: ReturnType<typeof analyzeText>;
  tips: string[];
  bestHour: number;
  suggestedTags: string[];
};

const PRIME_HOURS = [10,11,12,18,19,20,21];
const TAG_LIMIT = 7;

function clamp(n:number, lo:number, hi:number){ return Math.max(lo, Math.min(hi, n)); }

export function predictVirality(input: Input): ScoreOut {
  const title = (input.title||"").trim();
  const caption = (input.caption||"").trim();
  const tags = (input.tags||[]).map(t=>t.toLowerCase().replace(/[^a-z0-9_-]/g,"")).filter(Boolean);

  const text = (title + " " + caption).trim();
  const sent = analyzeText(text);
  const reasons:string[] = [];
  let pts = 60;

  if(title.length >= 18 && title.length <= 72){ pts += 8; reasons.push("Balanced title length"); }
  else if(title.length < 8){ pts -= 6; reasons.push("Title too short"); }
  else if(title.length > 90){ pts -= 4; reasons.push("Title long"); }

  if(caption.length > 0 && caption.length < 220){ pts += 5; reasons.push("Concise caption"); }
  else if(caption.length===0){ pts -= 2; reasons.push("No caption"); }
  else if(caption.length>300){ pts -= 3; reasons.push("Caption too long"); }

  const uniq = new Set(tags).size;
  if(uniq>=3 && uniq<=7){ pts += 6; reasons.push("Good tag count"); }
  if(uniq===0){ pts -= 6; reasons.push("No tags"); }
  if(uniq>10){ pts -= 3; reasons.push("Too many tags"); }

  const d = Number(input.durationSec||0);
  if(d>0){
    if(d<=15) { pts += 6; reasons.push("Short & punchy"); }
    else if(d<=45){ pts += 3; reasons.push("Optimal short length"); }
    else if(d>120){ pts -= 6; reasons.push("Long for short-form"); }
  }

  if(sent.sentiment==="positive"){ pts += 4; reasons.push("Positive sentiment"); }
  if(sent.sentiment==="negative"){ pts -= 4; reasons.push("Negative sentiment risk"); }
  if(sent.emotion==="joy" || sent.emotion==="surprise"){ pts += 4; reasons.push("High-arousal emotion: " + sent.emotion); }

  const hour = Number.isFinite(input.hourLocal) ? (input.hourLocal as number) : -1;
  let bestHour = PRIME_HOURS[0];
  if(hour>=0){
    const near = PRIME_HOURS.reduce((best, h)=> Math.abs(h-hour) < Math.abs(best-hour) ? h : best, PRIME_HOURS[0]);
    if(PRIME_HOURS.includes(hour)){ pts += 5; reasons.push("Posting at a prime hour"); }
    else if(Math.abs(near-hour)<=1){ pts += 2; reasons.push("Near-prime hour"); }
    else { pts -= 2; reasons.push("Off-hour posting"); }
    bestHour = near;
  }

  pts = clamp(Math.round(pts), 0, 100);
  const grade = pts>=90 ? "S" : pts>=80 ? "A" : pts>=70 ? "B" : pts>=60 ? "C" : "D";

  const baseSuggest = new Set<string>([
    ...tags.slice(0,TAG_LIMIT),
    ...(sent.sentiment==="positive" ? ["feelgood","uplift"] : sent.sentiment==="negative" ? ["realtalk","unfiltered"] : ["daily","now"]),
    ...(sent.emotion==="joy" ? ["joy","happy"] : sent.emotion==="surprise" ? ["wow","unexpected"] : [])
  ]);
  const suggestedTags = Array.from(baseSuggest).slice(0, TAG_LIMIT);

  const tips:string[] = [];
  if(grade!=="S" && grade!=="A"){
    if(title.length<18) tips.push("Make the title more descriptive (18–72 chars).");
    if(uniq<3) tips.push("Add 3–7 focused tags.");
    if(d>120) tips.push("Trim the video to under 60–90s.");
    if(sent.sentiment==="negative") tips.push("Balance negative tone with constructive phrasing.");
  }
  tips.push("Try posting at " + bestHour + ":00 local.");

  return { score: pts, grade, reasons, sentiment: sent, tips, bestHour, suggestedTags };
}

export function boostAdvice(score:number){
  const tier = score>=90 ? "ultra" : score>=80 ? "high" : score>=70 ? "medium" : "low";
  const budget = score>=90 ? 200 : score>=80 ? 120 : score>=70 ? 60 : 20;
  const durationH = score>=80 ? 24 : 12;
  const note = score>=80 ? "Eligible for featured experiment" : "Run small A/B on tags then boost";
  return { tier, budget, durationH, note };
}

export function copilotSuggestions(input: Input){
  const s = predictVirality(input);
  const improvedTitle = (input.title||"").trim().length<18
    ? "Unlocking Joy: 5-Second Mood Shift"
    : (input.title||"");
  const improvedCaption = (input.caption||"").length>300
    ? (input.caption||"").slice(0,220) + "…"
    : (input.caption||"");
  return {
    score: s.score, grade: s.grade,
    title: improvedTitle,
    caption: improvedCaption,
    tags: s.suggestedTags,
    tips: s.tips
  };
}
