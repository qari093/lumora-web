/**
 * Minimal Once-UI config shim for Lumora.
 * Keeps RootLayout stable when optional Once-UI config file is absent.
 */

export const baseURL =
  (process.env.NEXT_PUBLIC_BASE_URL && String(process.env.NEXT_PUBLIC_BASE_URL)) ||
  "http://localhost:3000";

export const meta = {
  home: {
    title: "Lumora",
    description: "Lumora — unified portals (FYP, GMAR, Videos, NEXA, Movies, Live).",
    path: "/",
    canonical: "/",
    image: "/icon-512.png",
    robots: { index: true, follow: true },
    alternates: {},
  },
} as const;

/**
 * RootLayout expects `.variable` strings (classnames-compatible).
 * If you later adopt next/font, replace these with real font variables.
 */
export const fonts = {
  heading: { variable: "" },
  body: { variable: "" },
  label: { variable: "" },
  code: { variable: "" },
} as const;
