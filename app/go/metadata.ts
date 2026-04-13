import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lumora — Private Beta Access",
  description: "A private invite to enter Lumora.",
  openGraph: {
    title: "Lumora — Private Beta Access",
    description: "Tap to enter the private Lumora experience.",
    url: "https://www.lumora.app/go",
    siteName: "Lumora",
    images: [
      {
        url: "https://www.lumora.app/lumora-invite.png",
        width: 1024,
        height: 1024,
        alt: "Lumora Private Beta Invite",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumora — Private Beta Access",
    description: "Tap to enter the private Lumora experience.",
    images: ["https://www.lumora.app/lumora-invite.png"],
  },
};
