"use client";

import "@/src/styles/lumaspace/lumaspace-atmosphere-omega.css";

export default function LumaAtmosphereEngine() {
  return (
    <div className="ls-atmosphere" data-testid="ls-atmosphere-engine" aria-hidden="true">
      <div className="ls-atmosphere-nebula" />
      <div className="ls-atmosphere-stars stars-a" />
      <div className="ls-atmosphere-stars stars-b" />
      <div className="ls-atmosphere-fog" />
      <div className="ls-atmosphere-light" />
      <div className="ls-atmosphere-breath" />
    </div>
  );
}
