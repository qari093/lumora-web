import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slot = searchParams.get("slot") || "home";
  const ads = [
    { id: "ad-zen-01", slot: "home",  title: "ZenShop — 15% OFF", cta: "Shop now", img: "/icon-192.png", price: 19.99 },
    { id: "ad-game-02", slot: "gmar", title: "Gmar — New Drop",   cta: "Play free", img: "/icon-192.png", price: 0 },
    { id: "ad-nexa-03", slot: "nexa", title: "NEXA Pro",          cta: "Upgrade",   img: "/icon-192.png", price: 49.0 }
  ];
  return NextResponse.json(ads.filter(a => a.slot === slot || slot === "all"));
}
