#!/usr/bin/env node
import Parser from "rss-parser";
import { synthTTS } from "./tts.mjs";
import { render } from "./render.mjs";
import { publish } from "./post.mjs";
import { ensureDir, hasFFmpeg, safeName } from "./_utils.mjs";
import { SUPPORTED } from "./lang.mjs";

const FEEDS = [
  { url:"https://www.reuters.com/world/rss", lang:"en", brand:"Reuters" },
  { url:"https://feeds.bbci.co.uk/news/world/rss.xml", lang:"en", brand:"BBC" },
  { url:"https://www.aljazeera.com/xml/rss/all.xml", lang:"en", brand:"Al Jazeera" },
  { url:"https://apnews.com/hub/apf-topnews?format=atom", lang:"en", brand:"AP" },
  { url:"https://www.dw.com/en/rss", lang:"en", brand:"DW" },
  // Fashion / lifestyle
  { url:"https://www.vogue.com/feed/rss", lang:"en", brand:"Vogue" },
  { url:"https://www.harpersbazaar.com/rss/all.xml/", lang:"en", brand:"Harper's Bazaar" },
  { url:"https://www.elle.com/rss/all.xml/", lang:"en", brand:"Elle" },
  // Entertainment / spicy
  { url:"https://www.tmz.com/rss.xml", lang:"en", brand:"TMZ" },
  { url:"https://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml", lang:"en", brand:"E! News" }
];

const args = Object.fromEntries(process.argv.slice(2).map(a=>{const [k,...r]=a.replace(/^--/,'').split("=");return [k,r.join("=")||true]}));
const COUNT = Number(args.count||12);
const CONC  = Number(args.concurrency||3);
const DUR_MIN = Number(args.min||20);
const DUR_MAX = Number(args.max||60);
const langs = (String(args.langs||"en,de,ur,es,fr").split(",").map(s=>s.trim()).filter(s=>s)).filter(l=>SUPPORTED.includes(l));

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function rand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
const BGs=["#0b1020","#101820","#1b2836","#202a44","#0d0f1a","#121428"];

function scriptFromItem(it, brand){
  const title = it.title?.trim() || "Breaking update";
  return `Title: ${title}
This is a Lumora ${brand} update.
Highlights are summarized for engagement.
Follow official outlets for details.
Stay informed with Lumora.`;
}

async function fetchItems(){
  const parser = new Parser(); const collected=[];
  for (const f of FEEDS){
    try{
      const feed = await parser.parseURL(f.url);
      for (const it of (feed.items||[]).slice(0,6)){
        collected.push({ title: it.title||"Untitled", link: it.link||"", brand:f.brand, lang:f.lang, date: it.isoDate||it.pubDate||new Date().toISOString() });
        if (collected.length >= COUNT) break;
      }
    }catch{}
    if (collected.length >= COUNT) break;
  }
  return collected.slice(0,COUNT);
}

async function main(){
  if (!(await hasFFmpeg())){ console.error("❌ ffmpeg missing"); process.exit(2); }
  ensureDir("outputs/video");
  const items = await fetchItems();
  console.log(`🗞 News fetched: ${items.length}`);

  let idx=0, active=0, ok=0, fail=0;
  const queue=[...items];
  const next = async ()=>{
    const news=queue.shift(); if(!news) return;
    active++;
    try{
      const dur=rand(DUR_MIN,DUR_MAX), fps=30, bg=pick(BGs);
      for (const L of langs){
        const slug=safeName(`${news.brand}-${news.title}-${L}-${dur}s`);
        const mp3=`outputs/video/${slug}.mp3`; const mp4=`outputs/video/${slug}.mp4`;
        const text=news.title.slice(0,90);
        const stamp=`${news.brand} • ${new Date(news.date).toLocaleString("en-GB")} • ${L.toUpperCase()}`;
        const script=scriptFromItem(news,news.brand);
        await synthTTS(script,L,mp3);
        await render({ text, mp3, out:mp4, dur, fps, bg, stamp });
        publish(mp4,{ title:`[${news.brand}] ${news.title}`, lang:L, niche:"news", tags:["news",news.brand,L], created:Date.now() });
        console.log(`✅ ${slug}`);
      }
      ok++;
    }catch(e){ fail++; console.error("❌",e.message); }
    active--; if(queue.length) next();
  };
  const starters=Math.min(CONC,queue.length);
  for(let i=0;i<starters;i++) next();
  await new Promise(r=>{const iv=setInterval(()=>{if(!queue.length&&active===0){clearInterval(iv);r(null);}},300);});
  console.log(`\n🏁 News done: ${ok} ok, ${fail} failed`);
}
main().catch(e=>{console.error("ENGINE ERROR:",e);process.exit(1);});
