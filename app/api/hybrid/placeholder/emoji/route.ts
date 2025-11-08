import { NextResponse } from "next/server";

export const runtime = "edge";

// Local emoji generator: builds SVG with glow + text label
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = decodeURIComponent(searchParams.get("t") || "✨");
  const size = 128;

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="28" ry="28" fill="url(#grad)" />
    <defs>
      <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#6ee7b7" />
        <stop offset="100%" stop-color="#3b82f6" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <text x="50%" y="55%" font-size="60" text-anchor="middle" dominant-baseline="middle" filter="url(#glow)" fill="#fff" font-family="Segoe UI Emoji">${text}</text>
  </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
