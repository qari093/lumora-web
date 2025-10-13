// app/api/creator/mock/route.ts
import { NextResponse } from "next/server";

type CreatorApp = {
  id: string;
  name: string;
  handle: string;
  category: string;
  bio?: string;
  ts: string;
  status: "new" | "review" | "approved" | "rejected";
};

const mock: CreatorApp[] = [
  { id: "cr_001", name: "Ayesha Ali", handle: "@ayesha", category: "Wellness", bio: "Mindful moments & breathwork.", ts: new Date(Date.now()-3600e3).toISOString(), status: "new" },
  { id: "cr_002", name: "Hamza Khan", handle: "@hamzak", category: "Comedy", bio: "Sketches & situational comedy.", ts: new Date(Date.now()-7200e3).toISOString(), status: "review" },
  { id: "cr_003", name: "Noor Fatima", handle: "@noorfx", category: "Art", bio: "Speed-paint & digital art.", ts: new Date(Date.now()-5400e3).toISOString(), status: "approved" },
  { id: "cr_004", name: "Ali Raza", handle: "@alirz", category: "Music", bio: "Bedroom beats & lo-fi.", ts: new Date(Date.now()-1800e3).toISOString(), status: "new" },
  { id: "cr_005", name: "Sana Malik", handle: "@sanam", category: "Fitness", bio: "Home workouts + nutrition.", ts: new Date(Date.now()-300e3).toISOString(), status: "review" },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Math.max(1, Math.min(20, Number(url.searchParams.get("limit") ?? "5")));
  const rows = mock.slice(0, limit);
  return NextResponse.json({ ok: true, count: rows.length, rows }, { headers: { "Cache-Control": "no-store" } });
}
