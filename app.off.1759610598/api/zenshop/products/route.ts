import { NextResponse } from "next/server";

export async function GET() {
  // You can add more later; use id format "skin_..."
  const items = [
    { id: "skin_aurora", title: "Aurora Hero Skin", priceZen: 7, type: "skin", hero: "Aurora" },
    { id: "skin_raven",  title: "Raven Hero Skin",  priceZen: 7, type: "skin", hero: "Raven" },
    { id: "skin_blaze",  title: "Blaze Hero Skin",  priceZen: 7, type: "skin", hero: "Blaze" },
    { id: "skin_hawk",   title: "Hawk Hero Skin",   priceZen: 7, type: "skin", hero: "Hawk"  },
    { id: "bundle_boost", title: "Boost Bundle (x3)", priceZen: 5, type: "boost", qty: 3 }
  ];
  return NextResponse.json({ ok:true, items });
}
