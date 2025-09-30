export type TvChannel = { key:string; name:string; url:string; tags: string[] };
export type Ad = {
  id:string; title:string; slot:'top'|'bottom'|'overlay'; category:'supplement'|'gear'|'app';
  cta:string; url:string; format?:'banner'|'overlay'|'holo-3d';
};

export function decideChannel(channels: TvChannel[], ctx: { phase:'warmup'|'main'|'cooldown'; sportPref?:string }) {
  const prefer = ctx.phase==='main' ? ['football','basketball','highlight'] : ['analysis','tennis','skill'];
  return channels.find(c => c.tags.some(tag => prefer.includes(tag))) || channels[0];
}

export function decideAds(ads: Ad[], ctx: { phase:'warmup'|'main'|'cooldown'; goal:'FAT_LOSS'|'PERFORMANCE'|'LONGEVITY' }) {
  const slot = ctx.phase==='main' ? 'overlay' : (ctx.phase==='warmup' ? 'top' : 'bottom');
  const category = ctx.goal==='PERFORMANCE' ? 'supplement' : (ctx.goal==='FAT_LOSS' ? 'gear' : 'app');
  const holo = ads.filter(a => a.slot===slot && a.category===category && a.format==='holo-3d');
  if (holo.length) return holo[0];
  const pool = ads.filter(a => a.slot===slot && a.category===category);
  return pool.length? pool[0] : ads[0];
}
