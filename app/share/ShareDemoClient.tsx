"use client";

import { useState } from "react";
import { UniversalShareProvider, useUniversalShare } from "@/src/components/share/UniversalShareProvider";
import UniversalShareButton from "@/src/components/share/UniversalShareButton";
import UniversalShareFab from "@/src/components/share/UniversalShareFab";

const demoInput = {
  kind: "video" as const,
  sourcePortal: "fyp" as const,
  destinationPortal: "lumaspace" as const,
  sourceObjectId: "fyp_trace_demo_001",
  title: "A quiet wonder trace",
  description: "A soft discovery moment ready to become a memory.",
  createdBy: "founder",
  metadata: {
    mood: "wonder",
    atmosphere: "cyan-stardust",
    tags: ["fyp", "wonder", "lumaspace"],
  },
};

function ShareDemoInner() {
  const { lastShare } = useUniversalShare();
  const [showFab, setShowFab] = useState(true);

  return (
    <main
      data-testid="usl-share-demo-page"
      style={{
        minHeight: "100svh",
        padding: "max(28px, env(safe-area-inset-top)) 20px max(32px, env(safe-area-inset-bottom))",
        background: "radial-gradient(circle at 50% 0%, rgba(103,232,249,.16), transparent 34%), #02030a",
        color: "white",
      }}
    >
      <section style={{ maxWidth: 760, margin: "0 auto", display: "grid", gap: 18 }}>
        <p style={{ margin: 0, opacity: 0.72, letterSpacing: ".18em", fontSize: 12 }}>
          UNIVERSAL SHARE LAYER Ω∞
        </p>

        <h1 style={{ margin: 0, fontSize: "clamp(34px, 8vw, 68px)", letterSpacing: "-.06em" }}>
          Share with meaning.
        </h1>

        <p style={{ margin: 0, opacity: 0.78, lineHeight: 1.6, fontSize: 16 }}>
          One production share experience for FYP, LumaSpace, LumaLink, Live, Zendoro,
          Lumexa, Creator Hub, Memory Vault, external links, QR, silent sharing, echo sharing,
          and future portals.
        </p>

        <article
          data-testid="usl-demo-card"
          style={{
            marginTop: 14,
            padding: 18,
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: 28,
            background: "rgba(255,255,255,.055)",
            boxShadow: "0 24px 80px rgba(0,0,0,.35)",
          }}
        >
          <div style={{ opacity: 0.62, fontSize: 12, letterSpacing: ".14em" }}>FYP TRACE</div>
          <h2 style={{ margin: "8px 0 6px", fontSize: 24 }}>{demoInput.title}</h2>
          <p style={{ margin: 0, opacity: 0.72 }}>
            Demo object: FYP → LumaSpace as Memory Star, or LumaLink as conversation card.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
            <UniversalShareButton
              input={demoInput}
              label="Open Universal Share"
              recentDestinationIds={["lumalink"]}
              favoriteDestinationIds={["lumaspace"]}
            />

            <button
              type="button"
              data-testid="usl-toggle-fab"
              onClick={() => setShowFab((value) => !value)}
              style={{
                minHeight: 44,
                padding: "0 18px",
                border: 0,
                borderRadius: 999,
                cursor: "pointer",
                background: "rgba(255,255,255,.07)",
                color: "white",
              }}
            >
              Toggle FAB
            </button>
          </div>
        </article>

        {lastShare ? (
          <pre
            data-testid="usl-created-share-output"
            style={{
              overflow: "auto",
              padding: 14,
              borderRadius: 18,
              background: "rgba(0,0,0,.34)",
              color: "rgba(255,255,255,.82)",
              fontSize: 12,
            }}
          >
            {JSON.stringify(
              {
                id: lastShare.id,
                sourcePortal: lastShare.sourcePortal,
                destinationPortal: lastShare.destinationPortal,
                lifecycle: lastShare.lifecycle,
                transformation: lastShare.metadata.transformation,
              },
              null,
              2,
            )}
          </pre>
        ) : null}
      </section>

      {showFab ? <UniversalShareFab input={demoInput} /> : null}
    </main>
  );
}

export default function ShareDemoClient() {
  return (
    <UniversalShareProvider>
      <ShareDemoInner />
    </UniversalShareProvider>
  );
}
