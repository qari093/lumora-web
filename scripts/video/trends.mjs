import fs from "fs"; import { exists } from "./_utils.mjs";
/** Legal trend stub: pull topics from local JSONL or fallback defaults. */
const path = "data/video/trends.jsonl";
const fallback = [
  { title:"Daily Wellness Tips", niche:"health", lang:"en" },
  { title:"Berlin Tech Updates", niche:"tech", lang:"de" },
  { title:"Quick Cooking Hacks", niche:"food", lang:"en" },
  { title:"Fitness at Home", niche:"fitness", lang:"en" },
  { title:"AI News Roundup", niche:"tech", lang:"en" },
  { title:"Motivation for Students", niche:"education", lang:"en"},
  { title:"Crypto Market Snapshot", niche:"finance", lang:"en"},
  { title:"Urdu Motivational Quotes", niche:"motivation", lang:"ur"}
];
export function loadTrends(max=100){
  if (!exists(path)) return fallback.slice(0,max);
  const lines = fs.readFileSync(path,"utf8").split(/\r?\n/).filter(Boolean);
  return lines.slice(0,max).map((line,i)=>{try{return JSON.parse(line)}catch{ return fallback[i%fallback.length]; }});
}
if (import.meta.url === `file://${process.argv[1]}`){
  console.log(loadTrends(10));
}
