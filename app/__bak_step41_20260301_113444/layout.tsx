import type { Metadata, Viewport } from "next";
import { PrimaryNav } from "@/components/nav/PrimaryNav";
// app/layout.tsx
import "@/resources/custom.css";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import { _baseURL, _meta, _fonts } from "@/resources/once-ui.config";
import ClientLayout from "@/components/ClientLayout";
import SplashGate from "@/components/splash/SplashGate";
import BootMark from "@/components/splash/BootMark";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";


export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

export const metadata: Metadata = {
  applicationName: "Lumora",
  title: {
    default: "Lumora",
    template: "%s — Lumora"
  },
  description: "Your Space… Your Pace.",
  manifest: "/manifest.webmanifest",

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


const _LUMORA_THEME_COLOR = "#070b14";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#00B3FF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const _SPLASH_DEBUG = process.env.NEXT_PUBLIC_LUMORA_DEBUG_SPLASH === "1";

  return (
    <html lang="en" suppressHydrationWarning data-lumora-theme="darkglass">
        <_meta name="lumora-data-mode" content={process.env.LUMORA_DATA_MODE || "seed"} />
      <head>

        <_meta name="color-scheme" content="dark" />
      </head>
      <body className="lumora-root">
<PrimaryNav />
        <ServiceWorkerRegister />
        
        <SplashGate durationMs={1400} fadeOutMs={220} />
        <BootMark />
        <ClientLayout>{children}</ClientLayout>
      <script
  dangerouslySetInnerHTML={{
    __html: `(function(){try{if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(function(){});}}catch(e){}})();`,
  }}
/>
</body>
    </html>
  );
}
