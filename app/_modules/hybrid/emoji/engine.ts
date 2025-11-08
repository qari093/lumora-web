/**
 * Emoji Generator Engine v2
 * Deterministic SVG composer using a small trait library.
 * Only named exports; no default export.
 */

type RNG = () => number;

/** Mulberry32 PRNG for deterministic trait selection by seed */
export function rngFromSeed(seed: string): RNG {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    // map to [0,1)
    return (h >>> 0) / 4294967296;
  };
}

function pick<T>(rng: RNG, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

const palettes = [
  ["#FFD166", "#FFE29A", "#FFC43D"], // warm yellow
  ["#7BDFF2", "#B2F7EF", "#5ED3EA"], // aqua
  ["#CDB4DB", "#FFC8DD", "#FFAFCC"], // pastel pink
  ["#C1FBA4", "#9BF6FF", "#CAFFBF"], // mint
  ["#FDE68A", "#FCD34D", "#F59E0B"], // gold
  ["#F8A5C2", "#F78FB3", "#EA8685"], // rose
];

const eyeSets = [
  // classic
  (cx: number, cy: number) => `
    <circle cx="${cx - 18}" cy="${cy - 6}" r="5" fill="#111"/>
    <circle cx="${cx + 18}" cy="${cy - 6}" r="5" fill="#111"/>`,
  // happy
  (cx: number, cy: number) => `
    <path d="M ${cx-24} ${cy-8} q 6 -6 12 0" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M ${cx+12} ${cy-8} q 6 -6 12 0" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  // sleepy
  (cx: number, cy: number) => `
    <path d="M ${cx-24} ${cy-6} q 12 6 24 0" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M ${cx+24} ${cy-6} q -12 6 -24 0" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  // star
  (cx: number, cy: number) => `
    <polygon points="${cx-22},${cy-6} ${cx-20},${cy-12} ${cx-14},${cy-12} ${cx-18},${cy-16} ${cx-16},${cy-22} ${cx-22},${cy-18} ${cx-28},${cy-22} ${cx-26},${cy-16} ${cx-30},${cy-12} ${cx-24},${cy-12}" fill="#111"/>
    <polygon points="${cx+22},${cy-6} ${cx+20},${cy-12} ${cx+14},${cy-12} ${cx+18},${cy-16} ${cx+16},${cy-22} ${cx+22},${cy-18} ${cx+28},${cy-22} ${cx+26},${cy-16} ${cx+30},${cy-12} ${cx+24},${cy-12}" fill="#111"/>`,
];

const mouths = [
  (cx: number, cy: number) => `<path d="M ${cx-24} ${cy+16} q 24 20 48 0" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  (cx: number, cy: number) => `<circle cx="${cx}" cy="${cy+20}" r="10" fill="#111"/>`,
  (cx: number, cy: number) => `<path d="M ${cx-20} ${cy+18} q 20 -10 40 0" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  (cx: number, cy: number) => `<rect x="${cx-14}" y="${cy+12}" width="28" height="10" rx="4" fill="#111"/>`,
];

const accessories = [
  // none
  () => ``,
  // blush
  (cx: number, cy: number) => `
    <ellipse cx="${cx-28}" cy="${cy+8}" rx="8" ry="5" fill="#ff9aa2" opacity="0.6"/>
    <ellipse cx="${cx+28}" cy="${cy+8}" rx="8" ry="5" fill="#ff9aa2" opacity="0.6"/>`,
  // sunglasses
  (cx: number, cy: number) => `
    <rect x="${cx-34}" y="${cy-16}" width="24" height="14" rx="3" fill="#111"/>
    <rect x="${cx+10}" y="${cy-16}" width="24" height="14" rx="3" fill="#111"/>
    <rect x="${cx-10}" y="${cy-12}" width="20" height="2" fill="#111"/>`,
  // sweat drop
  (cx: number, cy: number) => `
    <path d="M ${cx+40} ${cy-26} c -6 8 -6 16 4 18 10 -2 10 -10 4 -18 -3 -4 -5 -6 -8 0z" fill="#5ED3EA"/>`,
  // sparkle
  (cx: number, cy: number) => `
    <path d="M ${cx-40} ${cy-26} l 4 8 8 4 -8 4 -4 8 -4 -8 -8 -4 8 -4z" fill="#fff" opacity="0.7"/>`,
];

export type EmojiSpec = {
  id: string;
  seed: string;
  palette: string[];
  eyes: number;
  mouth: number;
  acc: number;
};

export function specFromSeed(seed: string): EmojiSpec {
  const rng = rngFromSeed(seed);
  const pal = pick(rng, palettes);
  const eyes = Math.floor(rng() * eyeSets.length);
  const mouth = Math.floor(rng() * mouths.length);
  const acc = Math.floor(rng() * accessories.length);
  const id = `${seed}-${eyes}-${mouth}-${acc}`;
  return { id, seed, palette: pal, eyes, mouth, acc };
}

export function svgFromSpec(spec: EmojiSpec, size = 128): string {
  const [c0, c1, c2] = spec.palette;
  const cx = size / 2;
  const cy = size / 2;
  const gradId = `g_${spec.id.replace(/[^a-zA-Z0-9_]/g, "")}`;
  const face = `
    <defs>
      <radialGradient id="${gradId}" cx="50%" cy="35%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="70%" stop-color="${c0}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </radialGradient>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${size * 0.42}" fill="url(#${gradId})" />
    <circle cx="${cx}" cy="${cy}" r="${size * 0.42}" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
  `;
  const eyes = eyeSets[spec.eyes](cx, cy);
  const mouth = mouths[spec.mouth](cx, cy);
  const acc = accessories[spec.acc](cx, cy);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="emoji ${spec.id}">
  <rect width="${size}" height="${size}" fill="none"/>
  ${face}
  ${eyes}
  ${mouth}
  ${acc}
</svg>`;
}

export function generateEmojiSVG(seed: string, size = 128): string {
  return svgFromSpec(specFromSeed(seed), size);
}

/** Produce a stable catalog of N seeds like E001..ENNN */
export function catalogSeeds(n = 200): string[] {
  const out: string[] = [];
  for (let i = 1; i <= n; i++) {
    out.push(`E${String(i).padStart(3, "0")}`);
  }
  return out;
}

/** Lightweight listing with data URLs for quick preview in grid UIs */
export function listCatalog(n = 200, size = 96) {
  return catalogSeeds(n).map((seed) => {
    const spec = specFromSeed(seed);
    const svg = svgFromSpec(spec, size);
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    return { id: spec.id, seed, preview: dataUrl };
  });
}
