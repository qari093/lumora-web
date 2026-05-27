export type GmarConstellation = {
  id: string;
  name: string;
  cluster: "calm" | "competitive" | "strategy" | "social" | "experimental";
  status: "active" | "dormant";
};

export const gmarConstellations: GmarConstellation[] = [
  { id: "zen-flow", name: "Zen Flow", cluster: "calm", status: "active" },
  { id: "astro-shooter", name: "Astro Shooter", cluster: "competitive", status: "dormant" },
  { id: "pulse-grid", name: "Pulse Grid", cluster: "social", status: "dormant" },
  { id: "neural-heist", name: "Neural Heist: Black Minute", cluster: "strategy", status: "dormant" },
  { id: "gauntlet-of-mirrors", name: "The Gauntlet of Mirrors", cluster: "experimental", status: "dormant" },
];

export function activeConstellations(): GmarConstellation[] {
  return gmarConstellations.filter((constellation) => constellation.status === "active");
}

export function dormantConstellations(): GmarConstellation[] {
  return gmarConstellations.filter((constellation) => constellation.status === "dormant");
}
