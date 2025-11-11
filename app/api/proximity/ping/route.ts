import { NextResponse } from "next/server";
import { toCell } from "@/app/_lib/proximity/cell";

type Body = { lat?: number; lng?: number; accuracy?: number; radiusKm?: number };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const lat = typeof body.lat === "number" ? body.lat : NaN;
    const lng = typeof body.lng === "number" ? body.lng : NaN;
    const acc = typeof body.accuracy === "number" ? body.accuracy : 9999;
    const radiusKm = typeof body.radiusKm === "number" ? Math.max(5, Math.min(200, body.radiusKm)) : 50;

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ ok: false, error: "invalid_coords" }, { status: 400 });
    }

    const cell = toCell(lat, lng, 0.5);
    const payload = {
      ok: true,
      cellId: cell.id,
      center: cell.center,
      radiusKm,
      nextPingSec: acc > 1000 ? 15 : 60,
      // placeholders for future local inventory hooks
      nearby: { vendors: [], campaigns: [] },
    };

    const res = NextResponse.json(payload, { status: 200 });
    res.headers.set("Cache-Control", "no-store");
    res.cookies.set("geo_cell", cell.id, { path: "/", maxAge: 3600, sameSite: "lax" });
    res.cookies.set("geo_radius_km", String(radiusKm), { path: "/", maxAge: 3600, sameSite: "lax" });
    return res;
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
