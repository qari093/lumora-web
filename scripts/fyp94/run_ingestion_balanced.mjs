import fs from "fs";
import path from "path";
import { QUERIES, roundRobin } from "./queries.js";
import { MAX_PER_QUERY } from "./caps.js";
import { enforceRatio } from "./ratio.js";

const OUT = "public/native-fyp/real-meta/manifest.json";

let manifest = [];
if (fs.existsSync(OUT)) {
  manifest = JSON.parse(fs.readFileSync(OUT, "utf8"));
}

let id = manifest.length + 1;
let newItems = [];

for (let i = 0; i < 40; i++) {
  const query = roundRobin(i);

  newItems.push({
    id,
    query,
    source: "pexels",
    mp4Url: `/native-fyp/real/${id}.mp4`
  });

  id++;
}

const balanced = enforceRatio(newItems, MAX_PER_QUERY);
const finalManifest = [...manifest, ...balanced];

fs.writeFileSync(OUT, JSON.stringify(finalManifest, null, 2));

console.log("BALANCED_INGESTION_DONE");
