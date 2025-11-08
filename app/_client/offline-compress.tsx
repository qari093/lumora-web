'use client';
import React, { useEffect, useRef, useState } from 'react';

type BatchItem = { t: number; kind: string; payload: any };

async function gzipOrRaw(bytes: Uint8Array): Promise<{ body: Uint8Array; encoding: 'gzip' | 'identity' }> {
  try {
    // Browser CompressionStream if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CS: any = (globalThis as any).CompressionStream;
    if (CS) {
      const cs = new CS('gzip');
      const stream = new Response(new Blob([bytes]).stream().pipeThrough(cs)).arrayBuffer();
      const buf = new Uint8Array(await stream);
      return { body: buf, encoding: 'gzip' };
    }
  } catch {}
  return { body: bytes, encoding: 'identity' };
}

function utf8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export default function OfflineCompress() {
  const [queued, setQueued] = useState<number>(0);
  const [lastBytes, setLastBytes] = useState<number>(0);
  const [lastCount, setLastCount] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  // simple local queue key
  const KEY = 'lumora:batch:queue';

  function load(): BatchItem[] {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') as BatchItem[]; } catch { return []; }
  }
  function save(list: BatchItem[]) { localStorage.setItem(KEY, JSON.stringify(list)); }

  // API for others to enqueue
  useEffect(() => {
    const onEnq = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      const item: BatchItem = { t: Date.now(), kind: String(detail.kind || 'event'), payload: detail.payload ?? {} };
      const list = load(); list.push(item); save(list); setQueued(list.length);
    };
    const onSend = async () => { await flushNow(); };
    window.addEventListener('lumora:batch-enqueue', onEnq as EventListener);
    window.addEventListener('lumora:batch-send', onSend as EventListener);
    setQueued(load().length);
    return () => {
      window.removeEventListener('lumora:batch-enqueue', onEnq as EventListener);
      window.removeEventListener('lumora:batch-send', onSend as EventListener);
    };
  }, []);

  // auto flush when back online
  useEffect(() => {
    const h = () => { if (navigator.onLine) flushSoon(); };
    window.addEventListener('online', h);
    return () => window.removeEventListener('online', h);
  }, []);

  function flushSoon() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    // @ts-ignore
    timerRef.current = window.setTimeout(() => { flushNow(); }, 1500);
  }

  async function flushNow() {
    const list = load();
    if (!list.length) return;
    const raw = utf8(JSON.stringify(list));
    const { body, encoding } = await gzipOrRaw(raw);
    try {
      const res = await fetch('/api/offline/batch', {
        method: 'POST',
        headers: { 'content-type': 'application/octet-stream', 'content-encoding': encoding, 'x-items': String(list.length) },
        body,
      });
      if (!res.ok) throw new Error('batch failed');
      const json = await res.json();
      setLastBytes(body.byteLength);
      setLastCount(list.length);
      save([]); setQueued(0);
    } catch (e) {
      // keep queue; will retry later
    }
  }

  const chip: React.CSSProperties = {
    position: 'fixed', bottom: 210, right: 14, zIndex: 9996,
    background: 'rgba(22,22,30,0.75)', color: '#fff',
    padding: '8px 10px', borderRadius: 10, font: '600 12px/1.2 system-ui',
    boxShadow: '0 6px 20px rgba(0,0,0,.35)', backdropFilter: 'blur(6px)'
  };
  const btn: React.CSSProperties = { marginLeft: 8, padding: '4px 8px', borderRadius: 8, border: '1px solid #777', background: 'transparent', color: '#fff', cursor: 'pointer' };

  return (
    <div style={chip} title="Offline Compression & Batch">
      <div>Compress: <b>{'auto'}</b></div>
      <div>Queued: <b>{queued}</b></div>
      <div>Last send: <b>{lastCount}</b> items, <b>{lastBytes}</b> bytes</div>
      <div style={{ marginTop: 6 }}>
        <button style={btn} onClick={() => window.dispatchEvent(new CustomEvent('lumora:batch-enqueue', { detail: { kind: 'heartbeat', payload: { ua: navigator.userAgent } } }))}>Enqueue</button>
        <button style={btn} onClick={flushNow}>Send</button>
      </div>
    </div>
  );
}
