import fs from "fs";
import path from "path";

const COUNT = parseInt(process.env.COUNT || "5");
const CONC = parseInt(process.env.CONCURRENCY || "2");

const outDir = path.join(process.cwd(), "public/videos");
fs.mkdirSync(outDir, { recursive: true });
const indexFile = path.join(outDir, "index.json");

const index = fs.existsSync(indexFile) ? JSON.parse(fs.readFileSync(indexFile, "utf8")) : [];

for (let i = 0; i < COUNT; i++) {
  const slug = `vid-${Date.now()}-${i}`;
  const meta = { slug, title: `Auto Video #${i+1}`, duration: Math.floor(Math.random()*40+5), category: "auto" };
  index.push(meta);

  const file = path.join(outDir, `${slug}.mp4`);
  fs.writeFileSync(file, `FAKE_VIDEO_DATA_${slug}`);
  console.log("✓ created", file);
}

fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
console.log("✓ index updated:", indexFile);
