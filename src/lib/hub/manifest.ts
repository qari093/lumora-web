export type GameEntry = {
  id: string;
  title: string;
  desc?: string;
  engine: "pixi-td" | "phaser-rogue" | "nebula-wasm";
};
export const GAMES_HUB: GameEntry[] = [
  { id:"zen-fortress", title:"Zen Fortress", desc:"Tower Defense on Pixi", engine:"pixi-td" },
  { id:"zen-rogue", title:"Zen Rogue Legacy", desc:"Rogue-lite (Phaser stub)", engine:"phaser-rogue" },
  { id:"zen-moba", title:"Zen War Nexus", desc:"MOBA (Nebula WASM scaffold)", engine:"nebula-wasm" },
];
