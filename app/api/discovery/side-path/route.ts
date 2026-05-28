import { NextResponse } from "next/server";
import { createCuriousSidePath } from "@/lib/discovery/curiousSidePath";

export async function GET() {
  return NextResponse.json({
    ok: true,
    sidePath: createCuriousSidePath({
      currentLane: "Cosmic Drift",
      watchedLanes: ["Cosmic Drift"],
      intensity: 4
    })
  });
}
