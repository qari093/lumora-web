import fs from "fs"; import path from "path";
import { ensureDir, readJSON, writeJSON, safeName } from "./_utils.mjs";
const PUB="public/videos", IDX=path.join(PUB,"index.json");
export function publish(localMp4, meta){
  ensureDir(PUB);
  const slug = safeName(meta.slug || meta.title || Date.now());
  const dest = path.join(PUB, slug+".mp4");
  fs.copyFileSync(localMp4, dest);
  const idx = readJSON(IDX,{count:0, items:[]});
  idx.items.unshift({
    slug, file:"/videos/"+slug+".mp4",
    title: meta.title||slug, lang: meta.lang||"en",
    niche: meta.niche||"general", tags: meta.tags||[],
    created: meta.created||Date.now()
  });
  idx.count = idx.items.length;
  writeJSON(IDX, idx);
  return slug;
}
