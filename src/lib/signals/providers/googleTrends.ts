import fs from "node:fs/promises";
import path from "node:path";
import type { LumoraSignal } from "@/types/lumora.signal";
import { fetchJsonWithTimeout } from "@/lib/signals/core/http";

type RawGoogleTrendsSignal = {
  id?: string;
  title?: string;
  summary?: string;
  url?: string;
  authorHandle?: string;
  language?: string;
  region?: string;
  keywords?: string[];
  hashtags?: string[];
  velocityScore?: number;
  attentionScore?: number;
  saturationScore?: number;
  createdAt?: number;
  updatedAt?: number;
};

type GoogleTrendsIngestOptions = {
  limit?: number;
  useFixtureOnFailure?: boolean;
};

const FIXTURE_PATH = path.join(process.cwd(), "src/lib/signals/fixtures/google_trends.sample.json");

function toSafeArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .map((x) => x.trim());
}

function normalizeGoogleTrendsSignal(raw: RawGoogleTrendsSignal, index: number): LumoraSignal | null {
  const id = String(raw.id || "").trim() || `google_trends_${index}`;
  const title = String(raw.title || "").trim();
  const createdAt = typeof raw.createdAt === "number" ? raw.createdAt : Date.now();
  const updatedAt = typeof raw.updatedAt === "number" ? raw.updatedAt : Date.now();

  if (!title) return null;

  return {
    id,
    platform: "google_trends",
    title,
    summary: typeof raw.summary === "string" ? raw.summary.trim() : undefined,
    language: typeof raw.language === "string" ? raw.language.trim() : undefined,
    region: typeof raw.region === "string" ? raw.region.trim() : undefined,
    keywords: toSafeArray(raw.keywords),
    hashtags: toSafeArray(raw.hashtags),
    url: typeof raw.url === "string" ? raw.url.trim() : undefined,
    authorHandle: typeof raw.authorHandle === "string" && raw.authorHandle.trim() ? raw.authorHandle.trim() : undefined,
    trust: "verified",
    lifecycle: "rising",
    emotionTags: ["curiosity"],
    velocityScore: typeof raw.velocityScore === "number" ? raw.velocityScore : 0,
    saturationScore: typeof raw.saturationScore === "number" ? raw.saturationScore : 0,
    attentionScore: typeof raw.attentionScore === "number" ? raw.attentionScore : 0,
    createdAt,
    updatedAt,
  };
}

async function loadFixture(): Promise<LumoraSignal[]> {
  const json = await fs.readFile(FIXTURE_PATH, "utf8");
  const raw = JSON.parse(json) as RawGoogleTrendsSignal[];
  return raw
    .map((item, index) => normalizeGoogleTrendsSignal(item, index))
    .filter((item): item is LumoraSignal => !!item);
}

function buildProviderRequest(limit: number): { url: string; headers: Record<string, string> } {
  const url = process.env.GOOGLE_TRENDS_PROVIDER_URL?.trim();
  const token = process.env.GOOGLE_TRENDS_PROVIDER_TOKEN?.trim();

  if (!url) {
    throw new Error("GOOGLE_TRENDS_PROVIDER_URL is not configured");
  }

  return {
    url: url.includes("?") ? `${url}&limit=${limit}` : `${url}?limit=${limit}`,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
}

export async function ingestGoogleTrendsSignals(
  options: GoogleTrendsIngestOptions = {}
): Promise<{
  ok: boolean;
  source: "provider" | "fixture";
  count: number;
  signals: LumoraSignal[];
  error?: string;
}> {
  const limit = Math.max(1, Math.min(50, options.limit ?? 10));
  const useFixtureOnFailure = options.useFixtureOnFailure ?? true;

  try {
    const request = buildProviderRequest(limit);
    const payload = await fetchJsonWithTimeout<RawGoogleTrendsSignal[]>(request.url, {
      method: "GET",
      headers: request.headers,
      timeoutMs: 8000,
    });

    const signals = (Array.isArray(payload) ? payload : [])
      .map((item, index) => normalizeGoogleTrendsSignal(item, index))
      .filter((item): item is LumoraSignal => !!item)
      .slice(0, limit);

    return {
      ok: true,
      source: "provider",
      count: signals.length,
      signals,
    };
  } catch (error) {
    if (!useFixtureOnFailure) {
      return {
        ok: false,
        source: "provider",
        count: 0,
        signals: [],
        error: error instanceof Error ? error.message : "unknown_google_trends_ingest_error",
      };
    }

    const signals = await loadFixture();
    return {
      ok: true,
      source: "fixture",
      count: Math.min(limit, signals.length),
      signals: signals.slice(0, limit),
      error: error instanceof Error ? error.message : "unknown_google_trends_ingest_error",
    };
  }
}
