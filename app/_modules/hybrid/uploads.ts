import fs from "node:fs";
import path from "node:path";

const ROOT = "/tmp/lumora_uploads";

function ensureRoot() {
  try { fs.mkdirSync(ROOT, { recursive: true }); } catch {}
}

function safeExt(name: string): string {
  const m = name.toLowerCase().match(/\.(png|jpg|jpeg|webp|gif|bmp|heic|heif|avif)$/i);
  return m ? m[0] : ".bin";
}

export async function saveUpload(file: Blob): Promise<{ id: string; path: string; size: number; ext: string; filename: string; }> {
  ensureRoot();
  const ab = await file.arrayBuffer();
  const buf = Buffer.from(ab);
  const ext = safeExt((file as any).name || "");
  const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const filename = `upl-${id}${ext}`;
  const outPath = path.join(ROOT, filename);
  fs.writeFileSync(outPath, buf);
  return { id, path: outPath, size: buf.length, ext, filename };
}

export function getUploadPath(id: string): string | null {
  ensureRoot();
  try {
    const files = fs.readdirSync(ROOT);
    const hit = files.find(f => f.includes(id));
    return hit ? path.join(ROOT, hit) : null;
  } catch { return null; }
}
