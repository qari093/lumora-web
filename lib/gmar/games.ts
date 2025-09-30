export type EngineKind = "runner"|"flappy"|"shooter";
export type GmarGame = {
  id:string; title:string; short:string;
  genre:string; niche:string; cover:string;
  desc:string; engine:EngineKind; logo:string;
};

const ids = [
  "runner_1","runner_2","runner_3",
  "flappy_1","flappy_2",
  "shooter_1","shooter_2",
  "builder_1","tower_1","rogue_1",
  "brawler_1","craft_1","tactics_1","survival_1","moba_1"
];
const titles = [
  "Runner I","Runner II","Runner III",
  "Flappy I","Flappy II",
  "Shooter I","Shooter II",
  "Builder I","Tower I","Rogue I",
  "Brawler I","Craft I","Tactics I","Survival I","MOBA I"
];
const genres = ["Action","Puzzle","Shooter","Strategy","Simulation","Adventure","Racing","Builder","Defense","Roguelite","Brawler","Craft","Tactics","Survival","MOBA"];
const niches = ["strength","focus","endurance"];

function engineFor(id:string):EngineKind{
  if(id.startsWith("runner")) return "runner";
  if(id.startsWith("flappy")) return "flappy";
  if(id.startsWith("shooter")) return "shooter";
  return "runner";
}

export const GAMES:GmarGame[] = Array.from({length:15}).map((_,i)=>({
  id: ids[i],
  title: titles[i],
  short: "Play",
  genre: genres[i],
  niche: niches[i%3],
  cover: "/games/cover_"+(((i%5)+1))+".svg",
  logo: "/games/logos/"+ids[i]+".svg",
  desc: "40h story • Competitive modes • Offline-ready with ZenCoins",
  engine: engineFor(ids[i])
}));
