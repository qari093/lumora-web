import TelemetryTracker from "@/app/_client/TelemetryTracker";
/* NOTE: Add preload link manually if layout does not render <head> */
// FILE: app/layout.tsx
// Server layout → mounts a single client RuntimeRoot to avoid using next/dynamic with ssr:false in server files.

import "./_styles/emoji.css";
import "./_styles/holo.css";

import type { Metadata } from "next";
import RuntimeRoot from "./_client/runtime-root";
import { SplashGate } from "./_client/brand/SplashGate";

export const metadata: Metadata = {
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        id="lumora-root"
        data-app="lumora"
        style={{ overscrollBehaviorY: "contain", WebkitTapHighlightColor: "transparent" }}
      >
        <TelemetryTracker />
        {/* SplashGate intentionally disabled for stability */}
<noscript>Enable JavaScript for the best Lumora experience.</noscript>
        <RuntimeRoot />
        <SplashGate disabled>{children}</SplashGate>
      </body>
    </html>
  );
}
