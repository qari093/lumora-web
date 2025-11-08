import { NextResponse } from "next/server";

type Creative = {
  id: string;
  ownerId: string;
  kind: "image" | "video";
  mediaUrl: string;
  clickUrl: string;
  headline: string;
  body?: string | null;
  cta?: string | null;
};

const POOL: Record<string, Creative[]> = {
  OWNER_A: [
    {
      id: "ad_owner_a_001",
      ownerId: "OWNER_A",
      kind: "image",
      mediaUrl: "https://dummyimage.com/768x960/111827/ffffff&text=OWNER_A",
      clickUrl: "https://example.com/owner-a",
      headline: "Owner A Headline",
      body: "Sample creative from OWNER_A pool.",
      cta: "Learn More",
    },
  ],
};

const HOUSE: Creative = {
  id: "ad_house_000",
  ownerId: "HOUSE",
  kind: "image",
  mediaUrl: "https://dummyimage.com/768x960/0ea5e9/111827&text=Lumora+Ad",
  clickUrl: "https://lumora.app/",
  headline: "Advertise on Lumora",
  body: "Reach local audiences instantly.",
  cta: "Start Now",
};

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ownerId = url.searchParams.get("ownerId") || "";
  const pool = POOL[ownerId] || [];
  const creative = pool[0] || HOUSE;
  const reason = pool.length ? "owner-match" : "house-fallback";

  const payload = {
    ok: true,
    servedAt: new Date().toISOString(),
    pick: { reason, creative },
  };

  console.log("[ads/serve]", reason, creative.id);
  return NextResponse.json(payload, { status: 200 });
}

export async function HEAD() {
  return NextResponse.json({ ok: true, probe: "ads-serve" }, { status: 200 });
}
