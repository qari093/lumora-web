type LiveRankingShape = {
  title?: string;
  url?: string | null;
  media_type?: string;
  final_score?: number;
};

function mixHotSources<T extends LiveRankingShape>(items: T[]): T[] {
  const yt = items.filter((x) => x.media_type === 'youtube');
  const vid = items.filter((x) => x.media_type === 'video');
  const emb = items.filter((x) => x.media_type === 'embed');
  const rest = items.filter((x) => !['youtube', 'video', 'embed'].includes(x.media_type ?? ''));

  return [...yt.slice(0, 3), ...vid.slice(0, 3), ...emb.slice(0, 3), ...rest];
}

function deduplicateItems<T extends LiveRankingShape>(items: T[]): T[] {
  const seen = new Set<string>();

  return items.filter((x) => {
    const key = x.url ?? x.title;

    if (!key) return true;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function applyMediaScoreBoost<T extends LiveRankingShape>(items: T[]): T[] {
  return items.map((x) => {
    let boost = 0;

    if (x.media_type === 'video') boost = 20;
    if (x.media_type === 'youtube') boost = 15;
    if (x.media_type === 'embed') boost = 10;

    return {
      ...x,
      final_score: (typeof x.final_score === 'number' ? x.final_score : 0) + boost,
    };
  });
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { resolveMedia } from '@/src/lib/activation/mediaResolver';

type Item = {
  id: string;
  title: string;
  source: string;
  url?: string | null;
  score?: number;
  score_hint?: number;
  final_score?: number;
  media_url?: string | null;
  thumb_url?: string | null;
  media_type?: string;
};

function readJsonSafe(filePath: string): any {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function loadLatestFeedArtifact(): Item[] {
  const dir = path.join(process.cwd(), 'data', 'live_feed');
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((x) => /^feed_.*\.json$/i.test(x))
    .map((name) => {
      const full = path.join(dir, name);
      const st = fs.statSync(full);
      return { full, mtime: st.mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);

  for (const f of files) {
    const raw = readJsonSafe(f.full);

    if (raw?.data?.feed && Array.isArray(raw.data.feed)) {
      return raw.data.feed.map((x: any) => ({
        id: x.id,
        title: x.title,
        source: x.source,
        url: x.url ?? null,
        score: x.score ?? x.final_score ?? 0,
        score_hint: x.score ?? x.final_score ?? 0,
        final_score: x.final_score ?? x.score ?? 0,
        media_url: x.media_url ?? null,
        thumb_url: x.thumb_url ?? null,
        media_type: x.media_type ?? 'placeholder',
      }));
    }

    if (Array.isArray(raw)) {
      return raw.map((x: any) => ({
        id: x.id,
        title: x.title,
        source: x.source,
        url: x.url ?? null,
        score: x.score ?? x.final_score ?? 0,
        score_hint: x.score ?? x.final_score ?? 0,
        final_score: x.final_score ?? x.score ?? 0,
        media_url: x.media_url ?? null,
        thumb_url: x.thumb_url ?? null,
        media_type: x.media_type ?? 'placeholder',
      }));
    }
  }

  return [];
}

export async function GET() {
  try {
    let items: Item[] = loadLatestFeedArtifact();

    // resolver proof on non-youtube candidates only
    items = items.map((x, i) => {
      if (x && x.source !== 'youtube' && i < 3) {
        return {
          ...x,
          url: x.url || 'https://x.com/Interior/status/463440424141459456',
        };
      }
      return x;
    });

    items = items.map(resolveMedia);

    items = deduplicateItems(items);
    items = mixHotSources(items);
    items = applyMediaScoreBoost(items);
    return NextResponse.json({
      ok: true,
      data: {
        top: items.slice(0, 20),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'ranking_failed' }, { status: 500 });
  }
}
