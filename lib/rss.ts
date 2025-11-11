// lib/rss.ts
// Minimal, type-safe RSS/news helper to replace accidental shell content
// and make TypeScript happy. You can extend this later with real logic.

export interface NewsItem {
  title: string;
  link: string;
  publishedAt: string;
  source?: string;
  description?: string;
}

export interface FetchNewsOptions {
  topic?: string;
  limit?: number;
}

/**
 * Placeholder implementation.
 * Returns an empty list for now so the rest of the app can compile safely.
 */
export async function fetchNews(
  _options: FetchNewsOptions = {}
): Promise<NewsItem[]> {
  return [];
}
