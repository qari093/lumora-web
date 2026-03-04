"use client";

import { useEffect, useState } from "react";
import s from "./emoji-lab.module.css";

type ListItem = { id: string; seed: string; preview: string };

async function fetchList(n = 24, size = 128): Promise<ListItem[]> {
  const res = await fetch(`/api/hybrid/emoji/list?n=${n}&size=${size}`, { cache: "no-store" });
  if (!res.ok) throw new Error("list failed");
  const j = await res.json();
  return (j.items || []) as ListItem[];
}

async function genSvgDataUrl(seed: string, size = 128): Promise<string> {
  const res = await fetch(`/api/hybrid/emoji/gen?seed=${encodeURIComponent(seed)}&size=${size}`, { cache: "no-store" });
  if (!res.ok) throw new Error("gen failed");
  const svg = await res.text();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const dynamic = "force-dynamic";

export default function EmojiLab() {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const count = 24;
  const size = 128;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchList(count, size).then(arr => { if (mounted) setItems(arr); }).finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  async function refreshAll() {
    setLoading(true);
    try { setItems(await fetchList(count, size)); }
    finally { setLoading(false); }
  }

  async function regenerate(seed: string) {
    setBusyId(seed);
    try {
      const dataUrl = await genSvgDataUrl(seed, size);
      setItems(prev => prev.map(it => it.seed === seed ? { ...it, preview: dataUrl, id: `${seed}-${Date.now()}` } : it));
    } finally { setBusyId(null); }
  }

  async function download(seed: string) {
    setBusyId(seed);
    try {
      const res = await fetch(`/api/hybrid/emoji/gen?seed=${encodeURIComponent(seed)}&size=${size}`, { cache: "no-store" });
      const svg = await res.text();
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `lumora-emoji-${seed}.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 0);
    } finally { setBusyId(null); }
  }

  return (
    <div className={s.wrap}>
      <div className={s.head}>
        <h1 className={s.h1}>Emoji Lab</h1>
        <button className={s.btn} onClick={refreshAll} disabled={loading}>Refresh</button>
      </div>

      {loading && <div className={s.meta}>loading…</div>}

      <div className={s.grid}>
        {items.map(it => (
          <div className={s.tile} key={it.id}>
            <img className={s.img} src={it.preview} alt={it.id} />
            <div className={s.row}>
              <button className={s.btn} onClick={() => regenerate(it.seed)} disabled={busyId === it.seed}>Regenerate</button>
              <button className={s.btn} onClick={() => download(it.seed)} disabled={busyId === it.seed}>Download</button>
            </div>
            <div className={s.meta}>{it.seed}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
