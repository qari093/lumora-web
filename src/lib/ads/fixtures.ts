export type Creative = {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  image?: string;
  actionUrl?: string;
};

// Simple demo fixtures so /api/ads/serve returns something valid
export const demoCreatives: Creative[] = [
  { id: "c1", ownerId: "OWNER_A", title: "Local Café – Flat White €2.49", image: "/static/demo/cafe.jpg", actionUrl: "https://example.com/cafe" },
  { id: "c2", ownerId: "OWNER_A", title: "Gym 24/7 – First Week Free", image: "/static/demo/gym.jpg", actionUrl: "https://example.com/gym" },
  { id: "c3", ownerId: "OWNER_B", title: "Phone Repair – Same-Day", image: "/static/demo/phone.jpg", actionUrl: "https://example.com/repair" }
];

export function pickCreative(ownerId: string | null | undefined): Creative | null {
  const list = demoCreatives.filter(c => !ownerId || c.ownerId === ownerId);
  if (!list.length) return null;
  // naive rotation: pseudo-random pick
  const i = Math.floor(Math.random() * list.length);
  return list[i];
}
