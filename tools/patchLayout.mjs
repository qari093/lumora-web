import fs from "fs";
const file = "src/app/layout.tsx";
if (!fs.existsSync(file)) {
  console.log("layout.tsx not found, skipping injection");
  process.exit(0);
}
let s = fs.readFileSync(file, "utf8");

// Add import if missing
if (!s.includes(AppChrome)) {
  s = s.replace(/^/,
    import