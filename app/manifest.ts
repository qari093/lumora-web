import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lumora",
    short_name: "Lumora",
    description: "Your Space… Your Pace.",
    start_url: "/",
    display: "standalone",
    background_color: "#060812",
    theme_color: "#060812",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
