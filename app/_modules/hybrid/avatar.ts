// Deterministic avatar SVG generator
// Only named exports

type PRNG = () => number;
function mulberry32(a: number): PRNG {
  return function() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const faces = [
  { eyes: "◕ ◕", mouth: "‿", type: "smile" },
  { eyes: "• •", mouth: "—", type: "neutral" },
  { eyes: "• •", mouth: "︶", type: "soft" },
  { eyes: "× ×", mouth: "﹏", type: "tired" },
  { eyes: "ʘ ʘ", mouth: "o", type: "surprise" },
  { eyes: "˘ ˘", mouth: "_", type: "calm" },
];

const palettes = [
  ["#ffecd2", "#fcb69f"],
  ["#a1c4fd", "#c2e9fb"],
  ["#fddb92", "#d1fdff"],
  ["#f6d365", "#fda085"],
  ["#84fab0", "#8fd3f4"],
  ["#fccb90", "#d57eeb"],
  ["#fbc2eb", "#a6c1ee"],
];

function pick<T>(rng: PRNG, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function avatarSvg(seed: string, size: number = 160): string {
  const rng = mulberry32(hashSeed(seed));
  const [c1, c2] = pick(rng, palettes);
  const face = pick(rng, faces);
  const hue = Math.floor(rng() * 360);
  const acc = `hsl(${hue},70%,50%)`;
  const stroke = `rgba(0,0,0,0.28)`;
  const shadow = `rgba(0,0,0,0.10)`;

  const w = size, h = size;
  const headR = Math.floor(size * 0.36);
  const cx = Math.floor(size * 0.5);
  const cy = Math.floor(size * 0.46);

  const eyeX = Math.floor(size * 0.28);
  const eyeY = Math.floor(size * 0.43);
  const eyeDX = Math.floor(size * 0.18);

  const bodyW = Math.floor(size * 0.72);
  const bodyH = Math.floor(size * 0.42);
  const bodyX = cx - Math.floor(bodyW / 2);
  const bodyY = Math.floor(size * 0.62);

  const mouthY = Math.floor(size * 0.54);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="avatar ${seed}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <filter id="s">
      <feDropShadow dx="0" dy="${Math.max(1, Math.floor(size*0.01))}" stdDeviation="${Math.max(0.6, size*0.01)}" flood-color="${shadow}"/>
    </filter>
  </defs>

  <rect width="${w}" height="${h}" fill="none"/>

  <g filter="url(#s)">
    <rect x="${bodyX}" y="${bodyY}" rx="${Math.floor(size*0.1)}" width="${bodyW}" height="${bodyH}" fill="url(#g)" stroke="${stroke}" stroke-width="${Math.max(1, Math.floor(size*0.01))}"/>
    <circle cx="${cx}" cy="${cy}" r="${headR}" fill="url(#g)" stroke="${stroke}" stroke-width="${Math.max(1, Math.floor(size*0.01))}"/>
  </g>

  <g font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" text-anchor="middle">
    <text x="${cx - eyeDX}" y="${eyeY}" font-size="${Math.floor(size*0.18)}" fill="${acc}" dominant-baseline="middle">${face.eyes.split(" ")[0]}</text>
    <text x="${cx + eyeDX}" y="${eyeY}" font-size="${Math.floor(size*0.18)}" fill="${acc}" dominant-baseline="middle">${face.eyes.split(" ")[1]}</text>
    <text x="${cx}" y="${mouthY}" font-size="${Math.floor(size*0.22)}" fill="${acc}" dominant-baseline="middle">${face.mouth}</text>
  </g>
</svg>`;
}

export function dataUrl(seed: string, size: number = 160): string {
  const svg = avatarSvg(seed, size);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function listSeeds(n: number = 24): string[] {
  const seeds: string[] = [];
  for (let i = 1; i <= n; i++) {
    const id = String(100 + i);
    seeds.push(`A${id}`);
  }
  return seeds;
}
