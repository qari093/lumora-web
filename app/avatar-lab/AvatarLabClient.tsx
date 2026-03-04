"use client";

import { useEffect, useState } from "react";
import s from "./avatar-lab.module.css";

type Item = { id: string; seed: string; preview: string };

async function fetchList(n = 24, size = 160): Promise<Item[]> {
  const res = await fetch(`/api/hybrid/avatar/list?n=${n}&size=${size}`, { cache: "no-store" });
  if (!res.ok) throw new Error("list failed");
  const j = await res.json();
  return (j.items || []) as Item[];
}

async function genSvg(seed: string, size = 160): Promise<string> {
  const res = await fetch(`/api/hybrid/avatar/gen?seed=${encodeURIComponent(seed)}&size=${size}`, { cache: "no-store" });
  return await res.text();
}

export const dynamic = "force-dynamic";

export default function AvatarLab() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const count = 24;
  const size = 160;

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
    setBusy(seed);
    try {
      const svg = await genSvg(seed, size);
      const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
      setItems(prev => prev.map(it => it.seed === seed ? { ...it, preview: url, id: `${seed}-${Date.now()}` } : it));
    } finally { setBusy(null); }
  }

  async function download(seed: string) {
    setBusy(seed);
    try {
      const svg = await genSvg(seed, size);
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `lumora-avatar-${seed}.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 0);
    } finally { setBusy(null); }
  }

  return (
    <div className={s.wrap}>
      <div className={s.head}>
        <h1 className={s.h1}>Avatar Lab</h1>
        <button className={s.btn} onClick={refreshAll} disabled={loading}>Refresh</button>
      </div>

      {loading && <div className={s.meta}>loading…</div>}

      <div className={s.grid}>
        {items.map(it => (
          <div className={s.tile} key={it.id}>
            <img className={s.img} src={it.preview} alt={it.id} />
            <div className={s.row}>
              <button className={s.btn} onClick={() => regenerate(it.seed)} disabled={busy === it.seed}>Regenerate</button>
              <button className={s.btn} onClick={() => download(it.seed)} disabled={busy === it.seed}>Download</button>
            </div>
            <div className={s.meta}>{it.seed}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
