"use client";

import { useEffect, useState } from "react";
import "@/src/styles/lumaspace/homecoming-ritual-omega.css";

export default function HomecomingRitualOmega() {
  const [holdEnabled, setHoldEnabled] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setHoldEnabled(params.get("homecoming") === "hold");
  }, []);

  return (
    <section
      className={holdEnabled ? "ls-homecoming-ritual ls-homecoming-hold" : "ls-homecoming-ritual"}
      data-testid="ls-homecoming-ritual"
      data-homecoming-hold={holdEnabled ? "true" : "false"}
      aria-label="LumaSpace Homecoming"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        isolation: "isolate",
        pointerEvents: "none"
      }}
    >
      <div className="ls-homecoming-black" />

      <div className="ls-homecoming-blade" data-testid="ls-homecoming-blue-blade">
        <img
          src="/brand/lumora-brand-v2.png"
          alt=""
          aria-hidden="true"
          className="ls-homecoming-logo-img"
        />
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
