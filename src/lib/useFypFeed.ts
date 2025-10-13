"use client";
import { useCallback, useEffect, useRef, useState } from "react";
export type Clip = { id: string; title: string; url: string; createdAt: number };
type ApiResp = { ok?: boolean; items?: Clip[]; nextCursor?: number|null; hasMore?: boolean; pagination?: { nextCursor?: number|null; hasMore?: boolean } } | Clip[];

function getItems(r: ApiResp): Clip[] {
  if (Array.isArray(r)) return r as Clip[];
  const anyR: any = r;
  if (Array.isArray(anyR.items)) return anyR.items as Clip[];
  if (anyR.data && Array.isArray(anyR.data.items)) return anyR.data.items as Clip[];
  return [];
}
function getCursor(r: ApiResp): number|null { if (Array.isArray(r)) return null; const anyR:any=r; return (anyR.nextCursor ?? (anyR.pagination && anyR.pagination.nextCursor) ?? null) as number|null; }
function getHasMore(r: ApiResp): boolean   { if (Array.isArray(r)) return false; const anyR:any=r; return Boolean(anyR.hasMore ?? (anyR.pagination && anyR.pagination.hasMore) ?? false); }

export function useFypFeed(initialLimit = 6) {
  const [items, setItems] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,  setError ] = useState<string|null>(null);
  const [cursor, setCursor] = useState<number|null>(null);
  const [hasMore,setHasMore]= useState(false);
  const busy = useRef(false);

  const fetchPage = useCallback(async (cur: number|null) => {
    const qp = new URLSearchParams();
    qp.set("limit", String(initialLimit));
    if (cur) qp.set("cursor", String(cur));
    const res = await fetch("/api/fyp/recommend?" + qp.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error("recommend " + res.status);
    const json: ApiResp = await res.json();
    return { got: getItems(json), next: getCursor(json), more: getHasMore(json) };
  }, [initialLimit]);

  const loadInitial = useCallback(async () => {
    if (busy.current) return;
    busy.current = true; setLoading(true); setError(null);
    try {
      const { got, next, more } = await fetchPage(null);
      setItems(got); setCursor(next ?? null); setHasMore(more);
    } catch (e:any) { setError(String(e?.message || e)); }
    finally { setLoading(false); busy.current = false; }
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (busy.current || !hasMore) return;
    busy.current = true;
    try {
      const { got, next, more } = await fetchPage(cursor);
      setItems(prev => [...prev, ...got]); setCursor(next ?? null); setHasMore(more);
    } finally { busy.current = false; }
  }, [cursor, hasMore, fetchPage]);

  const prepend = useCallback((c: Clip) => setItems(prev => [c, ...prev]), []);
  const refresh = useCallback(async () => { setCursor(null); await loadInitial(); }, [loadInitial]);
  const reset = refresh;

  useEffect(() => { loadInitial(); }, [loadInitial]);
  return { items, loading, error, hasMore, loadMore, refresh, reset, prepend };
}
export default useFypFeed;
