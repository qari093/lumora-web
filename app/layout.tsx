// app/layout.tsx
import "@/resources/custom.css";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import { baseURL, meta, fonts } from "@/resources/once-ui.config";
import ClientLayout from "@/components/ClientLayout";
import SplashGate from "@/components/splash/SplashGate";
import BootMark from "@/components/splash/BootMark";

const LUMORA_THEME_COLOR = "#070b14";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: LUMORA_THEME_COLOR,
};

export const metadata: Metadata = {
  metadataBase: (() => {
    try {
      return new URL(baseURL);
    } catch {
      return undefined;
    }
  })(),
  title: meta?.home?.title ?? "Lumora",
  description: meta?.home?.description ?? "Lumora",
  applicationName: "Lumora",

  // PWA
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },

  // iOS standalone (Next emits apple-web-app tags, but some iOS flows still expect the legacy meta)
  appleWebApp: {
    capable: true,
    title: meta?.home?.title ?? "Lumora",
    statusBarStyle: "black-translucent",
  },

  // Extra hardening: force legacy iOS capable meta + mobile capable meta into <head>

  other: {
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const SPLASH_DEBUG = process.env.NEXT_PUBLIC_LUMORA_DEBUG_SPLASH === "1";

  return (
    <html lang="en" suppressHydrationWarning data-lumora-theme="darkglass">
      <head>

        <meta name="color-scheme" content="dark" />
      </head>
      <body className="lumora-root">
        
        <SplashGate durationMs={1400} fadeOutMs={220} />
        <BootMark />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
