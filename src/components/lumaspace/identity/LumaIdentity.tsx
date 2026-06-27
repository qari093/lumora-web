"use client";

import { defaultLumaIdentity, type LumaIdentityState } from "@/src/core/lumaspace/identity/runtime";
import MoodRingAvatar from "./MoodRingAvatar";
import CinematicProfile from "./CinematicProfile";

export default function LumaIdentity({
  identity = defaultLumaIdentity
}: {
  identity?: LumaIdentityState;
}) {
  return (
    <section
      data-testid="lumaspace-identity"
      style={{
        display: "grid",
        gap: 18,
        color: "white"
      }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <MoodRingAvatar mood={identity.mood} />
        <div>
          <h1 style={{ margin: 0, fontSize: 30, letterSpacing: "-.04em" }}>{identity.name}</h1>
          <p style={{ margin: "6px 0 0", color: "rgba(103,232,249,.86)", fontSize: 14 }}>
            {identity.aura} • {identity.mood}
          </p>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.66)", fontSize: 13 }}>
            {identity.quote}
          </p>
        </div>
      </div>
      <CinematicProfile mode={identity.profileMode} />
    </section>
  );
}
