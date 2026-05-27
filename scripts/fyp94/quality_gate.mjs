import fs from "node:fs";
import { dedupeFyp94Manifest } from "../../src/lib/fyp94/quality/duplicate.ts";

const MANIFEST = "public/native-fyp/real-meta/manifest.json";

if (!fs.existsSync(MANIFEST)) {
  throw new Error("manifest_missing");
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const deduped = dedupeFyp94Manifest(manifest);

fs.writeFileSync(MANIFEST, JSON.stringify(deduped, null, 2));

console.log(`QUALITY_GATE_INPUT=${manifest.length}`);
console.log(`QUALITY_GATE_OUTPUT=${deduped.length}`);
console.log("QUALITY_GATE_DONE");
