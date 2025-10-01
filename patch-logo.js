const fs = require('fs');
const path = require('path');

const pagePath = path.join(process.cwd(), 'app', 'game', 'hero-lab', 'page.tsx');

// Create minimal page if missing
if (!fs.existsSync(pagePath)) {
  fs.mkdirSync(path.dirname(pagePath), { recursive: true });
  fs.writeFileSync(
    pagePath,
`"use client";
import React from "react";
import HeaderLogo from "./HeaderLogo";

export default function Page(){
  return (
    <div style={{ padding: 20 }}>
      <HeaderLogo />
      <p>Welcome to Hero Lab.</p>
    </div>
  );
}
`,
    'utf8'
  );
  console.log('Created:', pagePath);
}

let s = fs.readFileSync(pagePath, 'utf8');

// Ensure import without escapes
const hasImport =
  s.includes('from "./HeaderLogo"') ||
  s.includes("from './HeaderLogo'") ||
  s.includes('import HeaderLogo from "./HeaderLogo"') ||
  s.includes("import HeaderLogo from './HeaderLogo'");

if (!hasImport) {
  if (/^["']use client["'];?\s*/.test(s)) {
    s = s.replace(/^["']use client["'];?\s*/, m => m + 'import HeaderLogo from "./HeaderLogo";\n');
  } else if (/import .+;/.test(s)) {
    s = s.replace(/(import[\s\S]+?;\s*)/, m => m + 'import HeaderLogo from "./HeaderLogo";\n');
  } else {
    s = 'import HeaderLogo from "./HeaderLogo";\n' + s;
  }
}

// Ensure a single <HeaderLogo />
const hasLogoTag = s.includes('<HeaderLogo');
if (!hasLogoTag) {
  if (/return\s*\(\s*<div[^>]*>/m.test(s)) {
    s = s.replace(/return\s*\(\s*<div[^>]*>/m, m => m + '\n      <HeaderLogo />');
  } else {
    // Fallback: prepend into component return if unexpected structure
    s = s.replace(/return\s*\(/, 'return (\n    <HeaderLogo />\n');
  }
}

fs.writeFileSync(pagePath, s, 'utf8');
console.log('Patched:', pagePath);
