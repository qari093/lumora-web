const fs = require("fs");
const p = "package.json";
const j = JSON.parse(fs.readFileSync(p, "utf8"));
j.devDependencies = j.devDependencies || {};
j.devDependencies.esbuild = "0.25.11";
for (const sect of ["dependencies","devDependencies","optionalDependencies"]) {
  if (!j[sect]) continue;
  for (const k of Object.keys(j[sect])) {
    if (k.startsWith("@esbuild/")) delete j[sect][k];
  }
}
fs.writeFileSync(p, JSON.stringify(j, null, 2));
console.log("✔ pinned esbuild=0.25.11 and removed @esbuild/*");
