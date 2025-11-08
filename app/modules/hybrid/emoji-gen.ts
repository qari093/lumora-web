/* Emoji Generator Engine v2 — procedural grid-based rendering */
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const EMOJI_DIR = path.join(process.cwd(), "public", "generated", "emojis");
if (!fs.existsSync(EMOJI_DIR)) fs.mkdirSync(EMOJI_DIR, { recursive: true });

export async function generateEmojiSVG(seed?: string) {
  const id = seed || randomUUID();
  const hue = Math.floor(Math.random() * 360);
  const face = ["😊", "😎", "😇", "🥳", "🤖", "😺", "🤩", "😌", "😢", "😡"][Math.floor(Math.random() * 10)];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <defs>
      <radialGradient id="g" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stop-color="hsl(${hue},90%,65%)"/>
        <stop offset="100%" stop-color="hsl(${(hue+30)%360},90%,45%)"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)" rx="40"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-size="90" font-family="Apple Color Emoji,Segoe UI Emoji" fill="white">${face}</text>
  </svg>`;
  const file = path.join(EMOJI_DIR, `${id}.svg`);
  fs.writeFileSync(file, svg);
  return { id, url: `/generated/emojis/${id}.svg` };
}
