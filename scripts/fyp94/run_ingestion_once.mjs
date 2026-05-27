import fs from "node:fs/promises";

const OUT_DIR = "public/native-fyp/real";
await fs.mkdir(OUT_DIR, { recursive: true });

const urls = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://media.w3.org/2010/05/sintel/trailer.mp4",
  "https://media.w3.org/2010/05/bunny/trailer.mp4"
];

let id = 1;

for (let round = 0; round < 14; round++) {
  for (const url of urls) {
    if (id > 40) break;

    const res = await fetch(url);
    if (!res.ok) continue;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 50_000) continue;

    await fs.writeFile(`${OUT_DIR}/${id}.mp4`, buffer);
    console.log(`✓ saved ${OUT_DIR}/${id}.mp4`);
    id++;
  }
}

console.log("INGESTION_DONE");
