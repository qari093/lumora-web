const fs = require('fs');
const p = 'package.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
let changed = false;

j.engines = j.engines || {};
if (j.engines.node !== '20.x') { j.engines.node = '20.x'; changed = true; }

const kill = (name) =>
  name.startsWith('@esbuild/') ||
  name.startsWith('@rollup/rollup-') ||
  name.startsWith('@next/swc-') ||
  name.startsWith('@parcel/watcher-') ||
  name === 'fsevents';

for (const sect of ['dependencies','devDependencies','optionalDependencies']) {
  if (!j[sect]) continue;
  for (const k of Object.keys(j[sect])) {
    if (kill(k)) { delete j[sect][k]; changed = true; }
  }
}

// ensure generic, cross-platform esbuild (dev dep) exists
j.devDependencies = j.devDependencies || {};
if (!(j.dependencies && j.dependencies.esbuild) && !j.devDependencies.esbuild) {
  j.devDependencies.esbuild = '^0.25.11';
  changed = true;
}

if (changed) fs.writeFileSync(p, JSON.stringify(j, null, 2));
console.log(changed ? 'patched package.json' : 'no changes needed');
