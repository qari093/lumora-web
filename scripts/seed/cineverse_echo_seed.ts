import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

type MovieSeed = {
  id: string;
  title: string;
  source: string;
  license: string;
  videoUrl: string;
  resolution: string | null;
  category: string;
};

type TrackSeed = {
  id: string;
  title: string;
  artist: string;
  license: string;
  audioUrl: string;
  genre: string;
};

function readJsonArray<T>(p: string): T[] {
  const raw = fs.readFileSync(p, "utf8");
  const j = JSON.parse(raw);
  if (!Array.isArray(j)) throw new Error(`json_not_array:${p}`);
  return j as T[];
}

function requireFields(kind: string, id: string, obj: any, fields: string[]) {
  for (const f of fields) {
    const v = obj?.[f];
    if (v === undefined || v === null || (typeof v === "string" && v.trim() === "")) {
      throw new Error(`${kind}_missing_required:${id}:${f}`);
    }
  }
}

function ensureHttpUrl(s: string, ctx: string) {
  if (typeof s !== "string") throw new Error(`invalid_url_type:${ctx}`);
  if (!/^https?:\/\//.test(s)) throw new Error(`invalid_url:${ctx}:${s}`);
  return s;
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const moviesPath = path.join(process.cwd(), "data/seed/cineverse/free_movies.json");
    const tracksPath = path.join(process.cwd(), "data/seed/echo/free_tracks.json");

    const movies = readJsonArray<MovieSeed>(moviesPath);
    const tracks = readJsonArray<TrackSeed>(tracksPath);

    // Delegates must exist (schema already validated in prior steps)
    const cine = (prisma as any).cineVerseMovie;
    const echo = (prisma as any).echoTrack;
    if (!cine?.upsert) throw new Error(`missing_delegate:cineVerseMovie`);
    if (!echo?.upsert) throw new Error(`missing_delegate:echoTrack`);

    let mOk = 0;
    for (const row of movies) {
      requireFields("movie", row.id || "(missing-id)", row, ["id", "title", "license", "videoUrl", "source", "category"]);
      const videoUrl = ensureHttpUrl(row.videoUrl, `movie:${row.id}:videoUrl`);
      const source = String(row.source || "public_domain");
      const rawRes = (row as any).resolution;
const nRes = Number.isFinite(Number(rawRes)) ? Number(rawRes) : 0;
const resolution = Math.max(0, Math.trunc(nRes));
      
      const resolutionStr = String(resolution);
const category = String(row.category || "Movies");

      await cine.upsert({
        where: { id: row.id },
        create: {
          id: row.id,
          title: row.title,
          source,
          license: row.license,
          videoUrl,
          resolution: resolutionStr,
          category,
        },
        update: {
          title: row.title,
          source,
          license: row.license,
          videoUrl,
          resolution: resolutionStr,
          category,
        },
      });
      mOk++;
    }

    let tOk = 0;
    for (const row of tracks) {
      requireFields("track", row.id || "(missing-id)", row, ["id", "title", "artist", "license", "audioUrl", "genre"]);
      const audioUrl = ensureHttpUrl(row.audioUrl, `track:${row.id}:audioUrl`);

      await echo.upsert({
        where: { id: row.id },
        create: {
          id: row.id,
          title: row.title,
          artist: row.artist,
          license: row.license,
          audioUrl,
          genre: row.genre,
        },
        update: {
          title: row.title,
          artist: row.artist,
          license: row.license,
          audioUrl,
          genre: row.genre,
        },
      });
      tOk++;
    }

    console.log(JSON.stringify({ ok: true, movies: mOk, tracks: tOk }));
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "seed_failed";
    console.log(JSON.stringify({ ok: false, error: msg }));
    process.exit(1);
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

main();
