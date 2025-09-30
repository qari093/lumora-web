export type HoloAd = {
  id:string; title:string; desc?:string; cta:string; price:number;
  productId:string; image:string; url:string;
  format?: "holo-3d"|"overlay";
  category?:string; tags?:string[];
};

const ADS: HoloAd[] = [
  { id:"ad_creatine", title:"3D Creatine Stack", desc:"Lab-tested performance", cta:"Click to buy", price:29.9, productId:"creatine-3d", image:"/ads/creatine.png", url:"#", format:"holo-3d", tags:["strength","gym","hiit"] },
  { id:"ad_heads",    title:"Neuro Headset",    desc:"Focus booster",           cta:"Click to buy", price:99.0, productId:"neuro-head",  image:"/ads/headset.png",  url:"#", format:"overlay", tags:["focus","runner","aim"] },
  { id:"ad_drink",    title:"Electrolyte+",     desc:"Hydration for tryhard",   cta:"Click to buy", price:19.5, productId:"electro+",    image:"/ads/drink.png",    url:"#", format:"overlay", tags:["endurance","stamina"] }
];

export function pickAd(niche?:string): HoloAd {
  if(!niche) return ADS[0];
  const hit = ADS.find(a=> (a.tags||[]).some(t=>t.toLowerCase()===(niche||"").toLowerCase()));
  return hit || ADS[Math.floor(Math.random()*ADS.length)];
}
export const ALL_ADS = ADS;
