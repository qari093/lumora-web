import type { Metadata } from "next";
import ShareTracker from "./ShareTracker";
import ShareActions from "./ShareActions";

export const metadata: Metadata = {
  title: "Share",
  description: "Share Lumora",
};

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export default function SharePage() {
  const shareUrl = `${APP_URL.replace(/\/$/, "")}/share`;
  const logoSrc = "/lumora-share-logo.svg";

  return (
    <>
      <ShareTracker />
      <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 24 }}>
        <section
          style={{
            width: "min(720px, 92vw)",
            borderRadius: 20,
            padding: 24,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(10,10,20,0.6)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div
              aria-hidden
              style={{
                width: 88,
                height: 88,
                borderRadius: 22,
                border: "1px solid rgba(255,255,255,0.18)",
                display: "grid",
                placeItems: "center",
                background: "rgba(0,0,0,0.35)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoSrc} alt="Lumora" width={72} height={72} />
            </div>
            <div style={{ flex: "1 1 auto" }}>
              <h1 style={{ margin: 0, fontSize: 28, letterSpacing: 0.5 }}>Lumora</h1>
              <p style={{ margin: "6px 0 0", opacity: 0.85 }}>
                Private preview — share the logo card. When opened, it takes users to the right entry point.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
            <div
              style={{
                borderRadius: 14,
                padding: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.25)",
                wordBreak: "break-all",
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: 13,
              }}
            >
              {shareUrl}
            </div>

            <ShareActions shareUrl={shareUrl} />

            <p style={{ margin: 0, opacity: 0.7, fontSize: 13 }}>
              Tip: WhatsApp/Telegram previews will show the Lumora logo image because we set OG/Twitter metadata globally.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
