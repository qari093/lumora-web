"use client";

import { generateTomorrowsVibe } from "@/lib/continuity/tomorrowsVibe";

export default function TomorrowsVibeCard() {
  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5">
      <div className="text-xs uppercase text-cyan-300/70">
        Tomorrow's Vibe
      </div>

      <div className="mt-2 text-white">
        {generateTomorrowsVibe()}
      </div>
    </div>
  );
}
