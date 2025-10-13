'use client';
import { useState } from 'react';

export default function TestFeed() {
  const [base, setBase] = useState('http://localhost:3000');
  const [source, setSource] = useState<'mock'|'sentiment'>('mock');
  const [limit, setLimit] = useState(5);
  const [log, setLog] = useState('');

  async function hit(path: string) {
    setLog('Loading…');
    try {
      const res = await fetch(path, { cache: 'no-store' });
      const data = await res.json();
      setLog(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setLog('Error: ' + (e?.message || 'unknown'));
    }
  }

  const feedPath =
    source === 'mock'
      ? `${base}/api/feed/mock?limit=${limit}`
      : `${base}/api/feed/sentiment?limit=${limit}`;

  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', padding: 20 }}>
      <h1>Lumora — Feed Tester</h1>

      <section style={{ display: 'grid', gap: 12, maxWidth: 800 }}>
        <label>
          Base URL:{' '}
          <input
            value={base}
            onChange={(e) => setBase(e.target.value)}
            style={{ width: 360 }}
          />
        </label>

        <label>
          Source:{' '}
          <select value={source} onChange={(e) => setSource(e.target.value as any)}>
            <option value="mock">Recent (mock)</option>
            <option value="sentiment">Sentiment-scored</option>
          </select>
        </label>

        <label>
          Limit:{' '}
          <input
            type="number"
            min={1}
            max={50}
            value={limit}
            onChange={(e) => setLimit(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            style={{ width: 80 }}
          />
        </label>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => hit(`${base}/api/ping`)}>GET /api/ping</button>
          <button onClick={() => hit(`${base}/api/videos/debug/list`)}>GET /api/videos/debug/list</button>
          <button onClick={() => hit(feedPath)}>
            GET {source === 'mock' ? '/api/feed/mock' : '/api/feed/sentiment'}
          </button>
        </div>

        <pre
          style={{
            whiteSpace: 'pre-wrap',
            background: '#111',
            color: '#0f0',
            padding: 12,
            borderRadius: 6,
            minHeight: 260,
            overflow: 'auto'
          }}
        >
{log || 'Logs will appear here…'}
        </pre>
      </section>
    </main>
  );
}
