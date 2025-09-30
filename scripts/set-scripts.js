const fs=require("fs");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
pkg.scripts=pkg.scripts||{};
pkg.scripts.reindex="curl -fsS -X POST http://localhost:3000/api/music/reindex || true";
pkg.scripts.ingest="curl -fsS -X POST http://localhost:3000/api/trends/ingest || true";
pkg.scripts.evolve="node scripts/evolve.js";
fs.writeFileSync("package.json", JSON.stringify(pkg,null,2));
console.log("✅ Scripts set: npm run reindex | npm run ingest | npm run evolve");
