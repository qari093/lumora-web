import fs from "fs";
import path from "path";

const ADS_FILE = path.join(process.cwd(), ".data", "ads_state.json");

type AdEvent = "view"|"click"|"skip"|"reward";
export type PlacementId = "videos_infeed"|"rewarded_wallet"|"game_overlay";

export type AdItem = {
  id: string;
  title: string;
  line: string;
  image?: string;
  cta?: string;
  url?: string;
  budget?: number;
  cap?: number;
  payout?: number; // reward payout in coins/zen
  placement: PlacementId;
  lang?: string;
};

export type Impression = {
  id: string;
  adId: string;
  placement: PlacementId;
  at: number;
  device?: string;
  lang?: string;
  events: Array<{ at:number; event:AdEvent }>;
};

export type AdsState = {
  ads: AdItem[];
  impressions: Impression[];
};

function load():AdsState{
  try{
    const raw = fs.readFileSync(ADS_FILE, "utf8");
    return JSON.parse(raw);
  }catch{
    return { ads: seedAds(), impressions: [] };
  }
}
function save(st:AdsState){
  try{ fs.writeFileSync(ADS_FILE, JSON.stringify(st,null,2)); }catch{}
}
function seedAds(): AdItem[]{
  const base:AdItem[] = [
    { id:"ad_creatine_1", title:"Creatine Pro Stack", line:"Ships today • €29", image:"/ads/creatine.png", cta:"Shop", url:"https://lumora.ai/shop/creatine", budget:1000, cap:5, payout:1, placement:"videos_infeed", lang:"en" },
    { id:"ad_wallet_bonus_1", title:"Watch to get +1 Zen", line:"Rewarded • Tap to watch", image:"/ads/reward.png", cta:"Watch", url:"#", budget:1000, cap:10, payout:1, placement:"rewarded_wallet", lang:"en" },
    { id:"ad_game_overlay_1", title:"Tap & Hold to Claim", line:"Limited reward", image:"/ads/hold.png", cta:"Hold", url:"#", budget:500, cap:3, payout:1, placement:"game_overlay", lang:"en" },
  ];
  return base;
}

function genId(prefix:string){ return prefix+"_"+Math.random().toString(36).slice(2,10); }

export function requestAd(placement:PlacementId, lang?:string, device?:string){
  const st=load();
  // pick first matching ad (lang fallback)
  const ad = st.ads.find(a => a.placement===placement && (!lang || a.lang===lang)) || st.ads.find(a=>a.placement===placement);
  if(!ad) return null;
  // check cap per device (simplified)
  const today = new Date().toISOString().slice(0,10);
  const used = st.impressions.filter(i => i.adId===ad.id && i.device===device && new Date(i.at).toISOString().slice(0,10)===today).length;
  if(ad.cap && used>=ad.cap) return { ad:null, reason:"cap_reached" };

  const imp:Impression = { id:genId("imp"), adId:ad.id, placement:ad.placement, at:Date.now(), device, lang, events:[{at:Date.now(), event:"view"}] };
  st.impressions.push(imp);
  save(st);
  return { ad, impressionId: imp.id };
}

export function trackEvent(impressionId:string, ev:AdEvent){
  const st=load();
  const imp = st.impressions.find(i => i.id===impressionId);
  if(!imp) return { ok:false, error:"unknown_impression" };
  imp.events.push({at:Date.now(), event:ev });
  save(st);
  return { ok:true };
}

export function report(){
  const st=load();
  const totals:Record<string,{views:number; clicks:number; rewards:number; skips:number}> = {};
  st.impressions.forEach(imp=>{
    if(!totals[imp.adId]) totals[imp.adId] = {views:0,clicks:0,rewards:0,skips:0};
    let t=totals[imp.adId];
    imp.events.forEach(e=>{
      if(e.event==="view") t.views++;
      if(e.event==="click") t.clicks++;
      if(e.event==="reward") t.rewards++;
      if(e.event==="skip") t.skips++;
    });
  });
  return { ads: st.ads, totals, impressions: st.impressions.slice(-50).reverse() };
}
