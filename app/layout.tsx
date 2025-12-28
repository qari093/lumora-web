import TelemetryTracker from "@/app/_client/TelemetryTracker";
import LumenDock from "./_client/LumenDock";
import StartupSplash from "./_client/StartupSplash";
/* NOTE: Add preload link manually if layout does not render <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Lumora" />
 */
// FILE: app/layout.tsx
// Server layout → mounts a single client RuntimeRoot to avoid using next/dynamic with ssr:false in server files.

import "./_styles/emoji.css";
import "./_styles/holo.css";

import type {Metadata, Viewport} from "next";
import RuntimeRoot from "./_client/runtime-root";
import { SplashGate } from "./_client/brand/SplashGate";

export const metadata: Metadata = {
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Lumora" },
  manifest: "/manifest.webmanifest",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Lumora",
  description: "Next-gen social-commerce-gaming-media platform.",

  openGraph: {
    type: "website",
    siteName: "Lumora",
    title: "Lumora",
    description: "Lumora private preview",
    images: [{ url: "/lumora-share-logo.svg", width: 1024, height: 1024, alt: "Lumora" }],
  },

  twitter: {
    card: "summary_large_image",
    title: "Lumora",
    description: "Lumora private preview",
    images: ["/lumora-share-logo.svg"],
  },

};
export const viewport: Viewport = {
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        id="lumora-root"
        data-app="lumora"
        style={{ overscrollBehaviorY: "contain", WebkitTapHighlightColor: "transparent" }}
      >
      {/* STEP135_TOPNAV */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,0.72)",
        borderBottom: "1px solid rgba(0,0,0,0.08)"
      }}>
        <div style={{
          maxWidth: 1040,
          margin: "0 auto",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12
        }}>
          <a href="/" style={{ fontWeight: 900, letterSpacing: "-0.02em", textDecoration: "none", color: "inherit" }}>
            Lumora
          </a>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <a href="/fyp" style={{ textDecoration: "none", color: "inherit", opacity: 0.85, fontSize: 13 }}>FYP</a>
            <a href="/gmar" style={{ textDecoration: "none", color: "inherit", opacity: 0.85, fontSize: 13 }}>GMAR</a>
            <a href="/videos" style={{ textDecoration: "none", color: "inherit", opacity: 0.85, fontSize: 13 }}>Videos</a>
            <a href="/nexa" style={{ textDecoration: "none", color: "inherit", opacity: 0.85, fontSize: 13 }}>NEXA</a>
            <a href="/movies" style={{ textDecoration: "none", color: "inherit", opacity: 0.85, fontSize: 13 }}>Movies</a>
            <a href="/celebrations" style={{ textDecoration: "none", color: "inherit", opacity: 0.85, fontSize: 13 }}>Celebrations</a>
            <a href="/share" style={{ textDecoration: "none", color: "inherit", opacity: 0.85, fontSize: 13 }}>Share</a>
            <a href="/live" style={{ textDecoration: "none", color: "inherit", opacity: 0.85, fontSize: 13 }}>Live</a>
          </div>
        </div>
      </div>

        <div id="lumora-splash-root" data-step="STEP133_SPLASH_READY" />
        <StartupSplash />
        <LumenDock />

        <TelemetryTracker />
        {/* SplashGate intentionally disabled for stability */}
<noscript>Enable JavaScript for the best Lumora experience.</noscript>
        <RuntimeRoot />
        <SplashGate disabled>{children}</SplashGate>
      </body>
    </html>
  );
}
