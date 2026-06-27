"use client";

import "@/src/styles/lumaspace/homecoming-ritual-omega.css";

export default function HomecomingRitualOmega() {
  const holdEnabled =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("homecoming") === "hold";

  return (
    <section
      className={holdEnabled ? "ls-homecoming-ritual ls-homecoming-hold" : "ls-homecoming-ritual"}
      data-testid="ls-homecoming-ritual"
      data-homecoming-hold={holdEnabled ? "true" : "false"}
      aria-label="LumaSpace Homecoming"
    >
      <div className="ls-homecoming-black" />

      <div className="ls-homecoming-blade" data-testid="ls-homecoming-blue-blade">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path
            d="M35 4C24 17 18 29 15 44c8-5 15-9 25-11-3 8-8 16-15 27 14-10 23-25 25-43-6 4-10 6-15 7 1-6 1-12 0-20Z"
            fill="url(#lsHomecomingBladeGradient)"
          />
          <defs>
            <linearGradient id="lsHomecomingBladeGradient" x1="12" y1="60" x2="52" y2="4">
              <stop stopColor="#38bdf8" />
              <stop offset="0.5" stopColor="#67e8f9" />
              <stop offset="1" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="ls-homecoming-spark" data-testid="ls-homecoming-spark" />

      <div className="ls-homecoming-promise" data-testid="ls-homecoming-promise">
        <span className="space">YOUR SPACE.</span>
        <span className="people">YOUR PEOPLE.</span>
        <span className="story">YOUR STORY.</span>
      </div>

      <div className="ls-homecoming-whisper" data-testid="ls-homecoming-whisper">
        Welcome home.
      </div>
    </section>
  );
}
