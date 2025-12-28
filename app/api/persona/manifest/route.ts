import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type ManifestEmoji = {
  id: string;
  url: string; // public URL
  kind: "svg" | "png" | "webp" | "jpg" | "jpeg" | "gif";
};

type PersonaManifest = {
  ok: true;
  version: number;
  generatedAt: string;
  emojis: ManifestEmoji[];
  // Future-proof fields (safe defaults):
  reactions: Array<{ id: string; emojiId: string }>;
  personas: Array<{ id: string; label: string }>;
};

const EMOJI_DIRS = [
  "public/persona/emojis",
  "public/emojis",
  "public/assets/emojis",
  "public/assets/persona/emojis",
];

function kindOf(file: string): ManifestEmoji["kind"] | null {
  const ext = path.extname(file).toLowerCase().replace(".", "");
  if (!ext) return null;
  if (ext === "svg" || ext === "png" || ext === "webp" || ext === "jpg" || ext === "jpeg" || ext === "gif") return ext;
  return null;
}

async function listEmojiFiles(): Promise<Array<{ abs: string; relPublic: string }>> {
  const cwd = process.cwd();
  for (const rel of EMOJI_DIRS) {
    const absDir = path.join(cwd, rel);
    try {
      const st = await fs.stat(absDir);
      if (!st.isDirectory()) continue;
      const names = await fs.readdir(absDir);
      const files = names
        .filter((n) => kindOf(n))
        .map((n) => ({
          abs: path.join(absDir, n),
          relPublic: "/" + path.posix.join(rel.replace(/^public\//, ""), n).replace(/\\/g, "/"),
        }));
      if (files.length) return files;
    } catch {
      // ignore missing dirs
    }
  }
  return [];
}

export async function GET() {
  const files = await listEmojiFiles();

  const emojis: ManifestEmoji[] = files
    .map((f) => {
      const base = path.basename(f.abs);
      const ext = kindOf(base);
      if (!ext) return null;
      const id = base.replace(path.extname(base), "");
      return { id, url: f.relPublic, kind: ext };
    })
    .filter((x): x is ManifestEmoji => Boolean(x))
    .sort((a, b) => a.id.localeCompare(b.id));

  const body: PersonaManifest = {
    ok: true,
    version: 1,
    generatedAt: new Date().toISOString(),
    emojis,
    reactions: [],
    personas: [],
  };

  return NextResponse.json(body, {
    headers: {
      "cache-control": "no-store",
    },
  });
}
