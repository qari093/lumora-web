"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type AuditTotals = { participants?: number; reactions?: number; rewards?: number };
type AuditRow = Record<string, any>;
type AuditPayload = {
  ok?: boolean;
  error?: string;
  totals?: AuditTotals;
  participants?: AuditRow[];
  reactions?: AuditRow[];
  rewards?: AuditRow[];
};

function toCsv(rows: AuditRow[]) {
  if (!rows || rows.length === 0) return "";
  const headers = Array.from(
    rows.reduce<Set<string>>((acc, r) => {
      Object.keys(r || {}).forEach(k => acc.add(k));
      return acc;
    }, new Set<string>())
  );
  const esc = (v: any) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const headerLine = headers.map(esc).join(",");
  const body = rows.map(r => headers.map(h => esc(r?.[h])).join(",")).join("\n");
  return headerLine + "\n" + body + "\n";
}

function download(name: string, content: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function ParticipantsPanel({ auditUrl }: { auditUrl?: string }) {
  const [data, setData] = useState<AuditPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const timer = useRef<number | null>(null);

  const url = auditUrl || "/api/celebrations/first-celebration-soft-launch/admin/audit";

  const fetchAudit = async () => {
    try {
      setLoading(true);
      const r = await fetch(url, { cache: "no-store" });
      const txt = await r.text();
      const j: AuditPayload = JSON.parse(txt);
      setData(j);
    } catch (e: any) {
      setData({ ok: false, error: String(e?.message || e) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
    // soft auto-refresh every 10s; safe alongside page-level refresh
    timer.current = window.setInterval(fetchAudit, 10000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const totals: AuditTotals = data?.totals || {};
  const participants = (data?.participants || []) as AuditRow[];
  const reactions = (data?.reactions || []) as AuditRow[];
  const rewards = (data?.rewards || []) as AuditRow[];

  const btn = { padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.06)", fontWeight: 800, cursor: "pointer" } as const;
  const card = { padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" } as const;
  const grid = { display:"grid", gridTemplateColumns:"repeat(3, minmax(0,1fr))", gap:12, marginTop:12 } as const;
  const tableWrap = { marginTop: 18, borderRadius: 12, border: "1px solid rgba(255,255,255,.12)", overflow: "hidden" } as const;
  const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: 13 } as React.CSSProperties;
  const th = { textAlign: "left", padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.04)" } as const;
  const td = { padding: "9px 12px", borderBottom: "1px solid rgba(255,255,255,.06)" } as const;

  const anyRows = useMemo(() => {
    if (participants.length) return { name: "participants", rows: participants };
    if (reactions.length) return { name: "reactions", rows: reactions };
    if (rewards.length) return { name: "rewards", rows: rewards };
    return { name: "participants", rows: [] as AuditRow[] };
  }, [participants, reactions, rewards]);

  const exportWhich = (key: "participants" | "reactions" | "rewards") => {
    const rows = (data?.[key] as AuditRow[]) || [];
    const csv = toCsv(rows);
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    download(`${key}-${ts}.csv`, csv);
  };

  return (
    <section style={{marginTop:12}}>
      <div style={{display: "flex", gap: 8, alignItems: "center"}}>
        <button onClick={fetchAudit} style={btn} title="Refresh now">{loading ? "Refreshing..." : "Refresh"}</button>
        <button onClick={() => exportWhich("participants")} style={btn} title="Export participants">Export Participants</button>
        <button onClick={() => exportWhich("reactions")} style={btn} title="Export reactions">Export Reactions</button>
        <button onClick={() => exportWhich("rewards")} style={btn} title="Export rewards">Export Rewards</button>
      </div>

      <div style={grid}>
        <div style={card}>
          <div style={{opacity:.8, fontSize:13}}>Participants</div>
          <div style={{fontSize:24, fontWeight:900, marginTop:6}}>{totals.participants ?? participants.length ?? 0}</div>
        </div>
        <div style={card}>
          <div style={{opacity:.8, fontSize:13}}>Reactions</div>
          <div style={{fontSize:24, fontWeight:900, marginTop:6}}>{totals.reactions ?? reactions.length ?? 0}</div>
        </div>
        <div style={card}>
          <div style={{opacity:.8, fontSize:13}}>Rewards</div>
          <div style={{fontSize:24, fontWeight:900, marginTop:6}}>{totals.rewards ?? rewards.length ?? 0}</div>
        </div>
      </div>

      <div style={tableWrap}>
        {anyRows.rows.length === 0 ? (
          <div style={{padding:16, opacity:.7}}>No rows available yet.</div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                {Object.keys(anyRows.rows[0]).map(h => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {anyRows.rows.slice(0, 200).map((r, i) => (
                <tr key={i}>
                  {Object.keys(anyRows.rows[0]).map(h => (
                    <td key={h} style={td}>{String(r?.[h] ?? "")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
