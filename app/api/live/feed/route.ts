import { applyAnomalyGuard } from '@/src/lib/learning/anomalyGuard';

function loadRealtimeEvents() {
  try {
    const fs = require('fs');
    const path = require('path');
    const file = path.join(process.cwd(), 'data/interaction_logs/events.ndjson');
    if (!fs.existsSync(file)) return [];
    const lines = fs.readFileSync(file, 'utf-8').trim().split('\n');
    const out = [];
    for (const l of lines) {
      try {
        const j = JSON.parse(l);
        if (Array.isArray(j.events)) out.push(...j.events);
      } catch {}
    }
    return out;
  } catch {
    return [];
  }
}
import { applyRealtimeFeedback } from '@/src/lib/learning/realtimeFeedback';
import { setTTL } from '@/src/lib/learning/cacheTTL';
import { applyFreshness } from '@/src/lib/learning/freshness';
import { getFeedCache, setFeedCache } from '@/src/lib/learning/feedCache';
import { applyRepeatPenalty } from '@/src/lib/learning/repeatPenalty';
import { applySessionDecay } from '@/src/lib/learning/sessionDecay';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { applyLearningScore } from '@/src/lib/learning/score';

type FeedItem = {
  rank?: number;
  id: string;
  title: string;
  source: string;
  topic?: string | null;
  score?: number;
  final_score?: number;
  media_url?: string | null;
  thumb_url?: string | null;
  media_type?: string | null;
  url?: string | null;
};

function normalize(items: any[]): FeedItem[] {
  return (Array.isArray(items) ? items : []).map((x: any, i: number) => ({
    rank: i + 1,
    id: x.id,
    title: x.title,
    source: x.source,
    topic: x.topic ?? x.media_type ?? x.source ?? 'general',
    score: x.score ?? x.final_score ?? 0,
    final_score: x.final_score ?? x.score ?? 0,
    media_url: x.media_url ?? null,
    thumb_url: x.thumb_url ?? 'https://placehold.co/600x400?text=Lumora',
    media_type: x.media_type ?? 'placeholder',
    url: x.url ?? null,
  }));
}

function enforceDiversity(feed: FeedItem[]): FeedItem[] {
  const out = [...feed];

  if (out.length > 0) {
    out[0] = {
      ...out[0],
      media_type: 'embed',
      media_url:
        out[0].media_url ||
        out[0].url ||
        'https://twitframe.com/show?url=https://x.com/Interior/status/463440424141459456',
    };
  }

  if (out.length > 1) {
    out[1] = {
      ...out[1],
      media_type: 'video',
      media_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    };
  }

  if (out.length > 2) {
    out[2] = {
      ...out[2],
      media_type: 'youtube',
      media_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    };
  }

  return out.slice(0, 20).map((x, i) => ({ ...x, rank: i + 1 }));
}

function loadInterests(): Record<string, number> {
  try {
    const file = path.join(process.cwd(), 'data', 'user_profiles', 'user_A.json');
    if (!fs.existsSync(file)) return {};
    const profile = JSON.parse(fs.readFileSync(file, 'utf-8'));
    return profile?.interests && typeof profile.interests === 'object' ? profile.interests : {};
  } catch {
    return {};
  }
}

export async function GET() {
  try {
    /* SAFE CACHE */
    const cacheKey = 'feed_A';
    const cached = getFeedCache(cacheKey);
    if (cached) {
      return NextResponse.json({ ok: true, data: { feed: cached } });
    }
    const base = 'http://127.0.0.1:3000';
    const r = await fetch(`${base}/api/live/ranking?user=A`, { cache: 'no-store' });
    const j = await r.json();

    const ranked = normalize(j?.data?.top || []);
    let feed = enforceDiversity(ranked);

    const interests = loadInterests();
    /* FINAL PERSONALIZATION */
    feed = applyFreshness(feed);
    feed = applyAnomalyGuard(feed);
    const realtimeEvents = loadRealtimeEvents();
    feed = applyRealtimeFeedback(feed, realtimeEvents);
    feed = applyLearningScore(feed, interests).map((x: any, i: number) => ({
      ...x,
      rank: i + 1,
    }));

    setFeedCache(cacheKey, feed);
    setTTL(cacheKey, 30000);
    return NextResponse.json({
      ok: true,
      data: { feed },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'feed_failed' }, { status: 500 });
  }
}
