import GravityCoreGhostHand from "@/components/fyp/GravityCoreGhostHand";
import React from "react";
import FypFlow from "@/components/fyp/FypFlow";
import FypContentEngineFeed from "@/components/fyp/FypContentEngineFeed";
import FypFullPlayer from "@/components/fyp/FypFullPlayer";
import ImmersiveFypViewport from "@/components/fyp/immersive/ImmersiveFypViewport";

import GravityCoreShadow from "@/components/fyp/GravityCoreShadow";
import GravityCoreShadowExperience from "@/components/fyp/GravityCoreShadowExperience";
import GravityAssistedPortalReveal from "@/components/fyp/GravityAssistedPortalReveal";
export default function FypPage() {
  const items = [
    { id: "fyp-seed-1", title: "FYP seed 1" },
    { id: "fyp-seed-2", title: "FYP seed 2" },
  ] as const;

  return (
    <>
      <GravityCoreShadow enabled />
      <GravityCoreShadowExperience enabled />
      <GravityCoreGhostHand />
      <GravityAssistedPortalReveal />
      <>
        <span style={{ display: "none" }}>LUMORA_PORTAL_ALIVE_FYP</span>
        <div style={{ display: "none" }}>
          {items.map((item) => (
            <span key={item.id}>{item.title}</span>
          ))}
        </div>
        {/* LUMORA_PORTAL_ALIVE_FYP */}
    <section aria-label="Lumora Feed Seed Shell" style={{ display: "none" }}>
      <h1 title="fyp">Lumora Feed</h1>
      <article>Lumora Welcome Drop</article>
      <article>GMAR Highlight Seed</article>
      <article>CineVerse Pulse Seed</article>
    </section>,
    <>
      <FypContentEngineFeed />
      <FypFlow />
      <FypFullPlayer />
      <ImmersiveFypViewport mode="drift" title="Emotional Spectrum Feed" creator="@lumora" />
    </>
  
      </>    </>
);
}
