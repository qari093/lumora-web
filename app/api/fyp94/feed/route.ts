import { NextResponse } from "next/server";
import { buildFyp94FinalFeed } from "@/src/lib/fyp94/feed/build";

function demoItem(id: string, category: string, thrillScore: number) {
  return {
    id,
    title: `Lumora ${category} pulse ${id}`,
    category,
    tags: [category, "pulse"],
    playbackUrl: `/native-fyp/fallback/${id}.mp4`,
    posterUrl: `/native-fyp/fallback/${id}.jpg`,
    thrillScore,
    source: "lumora_owned",
    layer: "supply" as const,
  };
}

export async function GET() {
  const supply = Array.from({ length: 12 }).map((_, index) =>
    demoItem(`supply_${index + 1}`, index % 2 === 0 ? "adrenaline" : "cinematic", 90 - index),
  );

  const wave = Array.from({ length: 8 }).map((_, index) =>
    demoItem(`wave_${index + 1}`, index % 2 === 0 ? "surf" : "bike", 86 - index),
  );

  const response = buildFyp94FinalFeed({
    layers: [wave, supply],
    recentlySeenIds: [],
    targetSize: 20,
  });

  return NextResponse.json(response, {
    headers: {
      "cache-control": "no-store",
    },
  });
}
