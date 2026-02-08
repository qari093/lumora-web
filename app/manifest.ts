import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lumora",
    short_name: "Lumora",
    description: "Your Space… Your Pace.",
    start_url: "/?source=a2hs",
    scope: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#00B3FF",
    icons: [
      { src: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/pwa/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/pwa/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}
