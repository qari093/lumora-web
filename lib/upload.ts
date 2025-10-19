import { promises as fs } from "node:fs";
import { join } from "node:path";

export async function saveBase64File(opts: { base64:string; dir:string; filename:string }) {
  const root = process.cwd();
  const base = join(root, "uploads", opts.dir);
  await fs.mkdir(base, { recursive: true });
  const buf = Buffer.from(opts.base64, "base64");
  const safe = opts.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const outPath = join(base, safe);
  await fs.writeFile(outPath, buf);
  return { path: outPath, size: buf.length };
}
