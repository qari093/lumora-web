import fs from "node:fs";
import { dedupeManifest } from "../../src/lib/fyp94/quality2/dedupe.ts";

const MANIFEST = "public/native-fyp/real-meta/manifest.json";

const data = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));

const deduped = dedupeManifest(data);

fs.writeFileSync(MANIFEST, JSON.stringify(deduped, null, 2));

console.log("QUALITY_V2_DONE", deduped.length);
