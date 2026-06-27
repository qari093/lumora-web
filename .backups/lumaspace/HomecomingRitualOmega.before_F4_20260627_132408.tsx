"use client";

import "@/src/styles/lumaspace/homecoming-ritual-omega.css";
import { HomecomingSequence } from "@/src/core/lumaspace/homecoming/homecomingSequence";
import { getHomecomingWhisper } from "@/src/core/lumaspace/homecoming/timeWhisper";

export default function HomecomingRitualOmega() {
  const whisper = getHomecomingWhisper();

  return (
    <div className="ls-ritual" data-testid="ls-homecoming-ritual-omega">
      <div className="ls-ritual-black" />
      <div className="ls-ritual-blade" data-testid="ls-ritual-blue-blade" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <path
            d="M35 4C24 17 18 29 15 44c8-5 15-9 25-11-3 8-8 16-15 27 14-10 23-25 25-43-6 4-10 6-15 7 1-6 1-12 0-20Z"
            fill="url(#ritualBladeGradient)"
          />
          <defs>
            <linearGradient id="ritualBladeGradient" x1="12" y1="60" x2="52" y2="4">
              <stop stopColor="#38bdf8" />
              <stop offset="0.5" stopColor="#67e8f9" />
              <stop offset="1" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="ls-ritual-spark" data-testid="ls-ritual-spark" />

      <div className="ls-ritual-promise" data-testid="ls-ritual-promise">
        {HomecomingSequence.promise.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>

      <div className="ls-ritual-whisper" data-testid="ls-ritual-whisper">
        {whisper}
      </div>
    </div>
  );
}
