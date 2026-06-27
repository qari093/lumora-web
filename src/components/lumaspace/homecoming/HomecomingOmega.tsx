"use client";

import { getHomecomingAtmosphere, getHomecomingWhisper } from "@/src/core/lumaspace/homecoming/timeWhisper";
import "@/src/styles/lumaspace/homecoming-omega.css";

export default function HomecomingOmega() {
  const whisper = getHomecomingWhisper();
  const atmosphere = getHomecomingAtmosphere();

  return (
    <div
      className={`ls-homecoming ls-homecoming-${atmosphere}`}
      data-testid="ls-homecoming-omega"
    >
      <div className="ls-homecoming-black" />

      <div className="ls-blade-mark" data-testid="ls-blue-blade">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path
            d="M35 4C24 17 18 29 15 44c8-5 15-9 25-11-3 8-8 16-15 27 14-10 23-25 25-43-6 4-10 6-15 7 1-6 1-12 0-20Z"
            fill="url(#bladeGradient)"
          />
          <defs>
            <linearGradient id="bladeGradient" x1="12" y1="60" x2="52" y2="4">
              <stop stopColor="#38bdf8" />
              <stop offset="0.5" stopColor="#67e8f9" />
              <stop offset="1" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="ls-spark" data-testid="ls-homecoming-spark" />

      <div className="ls-promise" data-testid="ls-homecoming-promise">
        <span>YOUR SPACE.</span>
        <span>YOUR PEOPLE.</span>
        <span>YOUR STORY.</span>
      </div>

      <div className="ls-homecoming-whisper" data-testid="ls-nexa-whisper">
        {whisper}
      </div>
    </div>
  );
}
