import fs from "fs";
import path from "path";

export type Ad = {
  id: string;
  title: string;
  line: string;
  image: string;
  cta: string;
  url: string;
  budget: number;       // max budget (not enforced here; used as info)
  cap: number;          // max impressions per user per day (frequency cap)
  payout: number;       // reward to user on "reward" event (if applicable)
  placement: string;    // "videos_infeed" | "rewarded_wallet" | "game_overlay"
  lang: string;         // "en" etc.
  ab?: { group: string; variants: { key: string; weight: number }[] };  // A/B config
  pacing?: { perMinute: number };  // soft pacing for requests per minute global
};

export type ImpressionEvent = { at: number; event: "view"|"click"|"skip"|"reward"|"hold" };
export type Impression = {
  id: string; adId: string; variant?: string; placement: string; at: number;
  device: string; lang: string; events: ImpressionEvent[];
};
type Totals = Record<string, { views:number; clicks:number; rewards:number; skips:number; byVariant?: Record<string, {views:number;clicks:number;rewards:number;skips:number}> }>;

type Store = { ads: Ad[]; impressions: Impression[]; totals: Totals; pacing: Record<string, number[]>; deviceDaily: Record<string, Record<string, number>> };

const FILE = path.join(process.cwd(), ".data", "ads-store.json");

function now(){ return Date.now(); }
function dayKey(ts:number){ const d = new Date(ts); return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`; }

export function loadStore():Store{
  try{
    const raw = fs.readFileSync(FILE, "utf8");
    const j = JSON.parse(raw);
    // Ensure fields exist
    j.totals ||= {};
    j.pacing ||= {};
    j.deviceDaily ||= {};
    j.impressions ||= [];
    j.ads ||= [];
    return j;
  }catch{
    return {
      ads: [
        {
          id: "ad_creatine_1",
          title: "Creatine Pro Stack",
          line: "Ships today • €29",
          image: "/ads/creatine.png",
          cta: "Shop",
          url: "https://lumora.ai/shop/creatine",
          budget: 1000,
          cap: 5,
          payout: 0,
          placement: "videos_infeed",
          lang: "en",
          ab: { group: "infeed_v1", variants: [ { key: "A", weight: 0.6 }, { key: "B", weight: 0.4 } ] },
          pacing: { perMinute: 120 }
        },
        {
          id: "ad_wallet_bonus_1",
          title: "Watch to get +1 Zen",
          line: "Rewarded • Tap to watch",
          image: "/ads/reward.png",
          cta: "Watch",
          url: "#",
          budget: 1000,
          cap: 10,
          payout: 1,
          placement: "rewarded_wallet",
          lang: "en",
          ab: { group: "reward_v1", variants: [ { key: "reward_v1_A", weight: 0.5 }, { key: "reward_v1_B", weight: 0.5 } ] },
          pacing: { perMinute: 60 }
        },
        {
          id: "ad_game_overlay_1",
          title: "Tap & Hold to Claim",
          line: "Limited reward",
          image: "/ads/hold.png",
          cta: "Hold",
          url: "#",
          budget: 500,
          cap: 3,
          payout: 1,
          placement: "game_overlay",
          lang: "en",
          ab: { group: "overlay_v1", variants: [ { key: "overlay_A", weight: 0.7 }, { key: "overlay_B", weight: 0.3 } ] },
          pacing: { perMinute: 30 }
        }
      ],
      impressions: [],
      totals: {},
      pacing: {},
      deviceDaily: {}
    };
  }
}
export function saveStore(s:Store){
  try{
    fs.writeFileSync(FILE, JSON.stringify(s, null, 2), "utf8");
  }catch{}
}

export function deviceFromHeaders(headers: Headers): string {
  const d = headers.get("x-device-id");
  if(d) return d;
  const f = headers.get("x-forwarded-for") || "127.0.0.1";
  return "dev-"+f;
}

function randomWeighted(variants: {key:string; weight:number}[]): string {
  const sum = variants.reduce((n,v)=>n+v.weight,0);
  const r = Math.random()*sum;
  let acc=0;
  for(const v of variants){
    acc+=v.weight; if(r<=acc) return v.key;
  }
  return variants[0]?.key || "A";
}

function underPacing(s:Store, ad:Ad): boolean {
  if(!ad.pacing?.perMinute) return true;
  const key=ad.id;
  const tlist = (s.pacing[key] ||= []);
  const t = now();
  const oneMinAgo = t - 60000;
  while(tlist.length && tlist[0] < oneMinAgo) tlist.shift();
  return tlist.length < ad.pacing.perMinute;
}
function markPacing(s:Store, ad:Ad){ (s.pacing[ad.id] ||= []).push(now()); }

function notOverDailyCap(s:Store, ad:Ad, device:string): boolean {
  const day = dayKey(now());
  const perDayDev = (s.deviceDaily[device] ||= {});
  const k = `${ad.id}:${day}`;
  const used = perDayDev[k] || 0;
  return used < (ad.cap||5);
}
function incDaily(s:Store, ad:Ad, device:string){
  const day = dayKey(now());
  const perDayDev = (s.deviceDaily[device] ||= {});
  const k = `${ad.id}:${day}`;
  perDayDev[k] = (perDayDev[k] || 0) + 1;
}

export function requestAd(s:Store, placement:string, lang:string, device:string){
  const candidates = s.ads.filter(a=> a.placement===placement && a.lang===lang);
  if(!candidates.length) return { ad:null, impression:null };
  // simple rotate: find first that is under pacing + under device cap
  for(const ad of candidates){
    if(!underPacing(s, ad)) continue;
    if(!notOverDailyCap(s, ad, device)) continue;
    const variant = ad.ab ? randomWeighted(ad.ab.variants) : undefined;
    const id = "imp_"+Math.random().toString(36).slice(2,10);
    const imp: Impression = {
      id,
      adId: ad.id,
      variant,
      placement: ad.placement,
      at: now(),
      device,
      lang,
      events: [{ at: now(), event: "view" }]
    };
    s.impressions.push(imp);
    markPacing(s, ad);
    // update totals
    const T = (s.totals[ad.id] ||= { views:0,clicks:0,rewards:0,skips:0, byVariant:{} as any });
    T.views++;
    if(variant){
      const BV = (T.byVariant ||= {});
      const tv = (BV[variant] ||= {views:0,clicks:0,rewards:0,skips:0});
      tv.views++;
    }
    incDaily(s, ad, device);
    return { ad, impression: imp };
  }
  return { ad:null, impression:null };
}

export function trackEvent(s:Store, impressionId:string, ev: "click"|"skip"|"reward"|"hold"){
  const imp = s.impressions.find(i => i.id===impressionId);
  if(!imp) return { ok:false, error:"no_impression" };
  imp.events.push({ at: now(), event: ev });
  const T = (s.totals[imp.adId] ||= { views:0,clicks:0,rewards:0,skips:0, byVariant:{} as any });
  if(ev==="click"){ T.clicks++; if(imp.variant){ const tv=(T.byVariant![imp.variant] ||= {views:0,clicks:0,rewards:0,skips:0}); tv.clicks++; } }
  else if(ev==="reward"){ T.rewards++; if(imp.variant){ const tv=(T.byVariant![imp.variant] ||= {views:0,clicks:0,rewards:0,skips:0}); tv.rewards++; } }
  else if(ev==="skip"){ T.skips++; if(imp.variant){ const tv=(T.byVariant![imp.variant] ||= {views:0,clicks:0,rewards:0,skips:0}); tv.skips++; } }
  // optional: degrade AB weights with poor performance (auto-optimizer simplified)
  // (not changing weights here; admin can adjust externally)
  return { ok:true, impression: imp };
}

export function abBreakdown(s:Store){
  // { group -> { variantKey -> { views,clicks,rewards,skips } } }
  const out: Record<string, Record<string, { views:number; clicks:number; rewards:number; skips:number }>> = {};
  for(const ad of s.ads){
    if(!ad.ab) continue;
    const g = ad.ab.group;
    out[g] ||= {};
    const T = s.totals[ad.id];
    if(!T?.byVariant) continue;
    for(const [k, tv] of Object.entries(T.byVariant)){
      const slot = (out[g][k] ||= { views:0, clicks:0, rewards:0, skips:0 });
      slot.views   += tv.views;
      slot.clicks  += tv.clicks;
      slot.rewards += tv.rewards;
      slot.skips   += tv.skips;
    }
  }
  return out;
}
