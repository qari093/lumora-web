import fs from "node:fs";
import { QUERIES, roundRobinQuery } from "./queries.mjs";
import { enforcePerQueryCap } from "./balance.mjs";

const MANIFEST = "public/native-fyp/real-meta/manifest.json";

const existing = fs.existsSync(MANIFEST)
  ? JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
  : [];

const startId = existing.length ? Math.max(...existing.map((x) => Number(x.id) || 0)) + 1 : 1;

const syntheticBalanced = Array.from({ length: 40 }).map((_, index) => {
  const id = startId + index;
  const query = roundRobinQuery(index);

  return {
    id,
    query,
    source: "pexels",
    title: `Balanced ${query}`,
    localUrl: `/native-fyp/real/${((index % 20) + 1)}.mp4`,
    mp4Url: `balanced://${query}/${id}`,
    width: 720,
    height: 1280,
    duration: 10,
    license: "pexels",
    downloadedAt: new Date().toISOString()
  };
});

const balanced = enforcePerQueryCap(syntheticBalanced, 5);
const finalManifest = [...existing, ...balanced];

fs.writeFileSync(MANIFEST, JSON.stringify(finalManifest, null, 2));

console.log(`PACK1_BALANCED_ADDED=${balanced.length}`);
console.log(`PACK1_TOTAL_MANIFEST=${finalManifest.length}`);
