import type { Metadata } from "next";
import { PrimaryNav } from "@/components/nav/PrimaryNav";
// app/layout.tsx
import "@/resources/custom.css";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import { baseURL, meta, fonts } from "@/resources/once-ui.config";
import ClientLayout from "@/components/ClientLayout";
import SplashGate from "@/components/splash/SplashGate";
import BootMark from "@/components/splash/BootMark";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";


export const metadata: Metadata = {
  applicationName: "Lumora",
  title: {
    default: "Lumora",
    template: "%s — Lumora"
  },
  description: "Your Space… Your Pace.",
  manifest: "/manifest.webmanifest",
  themeColor: "#00B3FF",
  appleWebApp: {
    capable: true,
    title: "Lumora",
    statusBarStyle: "black-translucent"
  },
  icons: {
    apple: [{ url: "/pwa/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    icon: [
      { url: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa/icon-512.png", sizes: "512x512", type: "image/png" }
    ]
  }
};


const LUMORA_THEME_COLOR = "#070b14";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: LUMORA_THEME_COLOR,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const SPLASH_DEBUG = process.env.NEXT_PUBLIC_LUMORA_DEBUG_SPLASH === "1";

  return (
    <html lang="en" suppressHydrationWarning data-lumora-theme="darkglass">
        <meta name="lumora-data-mode" content={process.env.LUMORA_DATA_MODE || "seed"} />
      <head>

        <meta name="color-scheme" content="dark" />
      </head>
      <body className="lumora-root">
<PrimaryNav />
        <ServiceWorkerRegister />
        
        <SplashGate durationMs={1400} fadeOutMs={220} />
        <BootMark />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
