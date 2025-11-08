import { NextResponse } from "next/server";

export const runtime = "edge";

function hashCode(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
}

function pickColors(seed: string) {
  const h = hashCode(seed || "lumora");
  const h1 = h % 360;
  const h2 = (h * 7) % 360;
  return {
    c1: `hsl(${h1}, 70%, 55%)`,
    c2: `hsl(${h2}, 70%, 45%)`,
  };
}

function initials(text: string) {
  const t = (text || "").trim();
  if (!t) return "👤";
  // If user passed emoji or single char, show as-is
  if ([...t].length <= 2) return t.toUpperCase();
  // Otherwise compute initials from words
  const parts = t.split(/\s+/).filter(Boolean);
  const first = [...(parts[0] || "")][0] || "";
  const last = [...(parts[parts.length - 1] || "")][0] || "";
  return (first + last).toUpperCase();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("t") || "";
  const seed = searchParams.get("seed") || text || "lumora";
  const size = Math.max(64, Math.min(512, Number(searchParams.get("s") || 160)));
  const { c1, c2 } = pickColors(seed);
  const label = initials(text);

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
      <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.6"/>
      </filter>
    </defs>

    <rect x="0" y="0" width="${size}" height="${size}" rx="${Math.round(size*0.22)}" fill="url(#g)"/>

    <!-- Silhouette -->
    <g transform="translate(${size/2}, ${size/2 + size*0.06})" opacity="0.16" filter="url(#soft)">
      <!-- Head -->
      <circle cx="0" cy="${-size*0.22}" r="${size*0.16}" fill="#000"/>
      <!-- Shoulders -->
      <path d="M ${-size*0.3} ${size*0.1} C ${-size*0.12} ${-size*0.06}, ${size*0.12} ${-size*0.06}, ${size*0.3} ${size*0.1} L ${size*0.3} ${size*0.28} L ${-size*0.3} ${size*0.28} Z" fill="#000"/>
    </g>

    <!-- Initials / emoji -->
    <text x="50%" y="55%" font-size="${Math.round(size*0.38)}" text-anchor="middle" dominant-baseline="middle"
          fill="rgba(255,255,255,0.96)" font-family="ui-sans-serif, -apple-system, Segoe UI Emoji, Segoe UI, Roboto, Helvetica, Arial">
      ${label}
    </text>
  </svg>`;

  return new NextResponse(svg.trim(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
