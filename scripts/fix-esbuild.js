const fs=require("fs");
const p="package.json";
const j=JSON.parse(fs.readFileSync(p,"utf8"));
j.engines=j.engines||{};
j.engines.node="20.x";
for (const sect of ["dependencies","devDependencies","optionalDependencies"]) {
  if (!j[sect]) continue;
  for (const k of Object.keys(j[sect])) if (k.startsWith("@esbuild/")) delete j[sect][k];
}
j.devDependencies=j.devDependencies||{};
if(!(j.dependencies&&j.dependencies.esbuild) && !j.devDependencies.esbuild){ j.devDependencies.esbuild="^0.25.10"; }
fs.writeFileSync(p,JSON.stringify(j,null,2));
console.log("patched package.json");
