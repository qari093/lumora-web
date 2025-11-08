"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefresher({
  intervalMs = 5000,
  auditUrl
}: {
  intervalMs?: number;
  auditUrl: string;
}) {
  const router = useRouter();

  // manual helpers
  const exportCsv = async () => {
    try {
      const r = await fetch(auditUrl, { cache: "no-store" });
      const j = await r.json();
      const rows: string[] = [];
      rows.push("key,value");
      rows.push(`participants,${j?.totals?.participants ?? 0}`);
      rows.push(`reactions,${j?.totals?.reactions ?? 0}`);
      rows.push(`rewards,${j?.totals?.rewards ?? 0}`);
      const blob = new Blob([rows.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "celebration_audit.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };
  const openJson = () => { try { window.open(auditUrl, "_blank"); } catch {} };
  const copyUrl  = async () => { try { await navigator.clipboard.writeText(auditUrl); } catch {} };

  // auto refresh
  useEffect(() => {
    let t: any;
    const tick = () => { try { router.refresh(); } catch {} };
    t = setInterval(tick, intervalMs);
    return () => clearInterval(t);
  }, [router, intervalMs, auditUrl]);

  const btn: React.CSSProperties = {
    padding:"8px 12px",
    borderRadius:10,
    border:"1px solid rgba(255,255,255,.2)",
    background:"rgba(255,255,255,.06)",
    fontWeight:800,
    cursor:"pointer"
  };

  return (
    <div style={{display:"inline-flex", gap:8, marginLeft:12}}>
      <button data-cy="audit-refresh" onClick={() => { try { router.refresh(); } catch {} }} style={btn} title="Manual refresh">Refresh</button>
      <button onClick={exportCsv} style={btn} title="Export current audit as CSV">Export CSV</button>
      <button onClick={openJson} style={btn} title="Open raw audit JSON">Open JSON</button>
      <button onClick={copyUrl} style={btn} title="Copy audit URL">Copy URL</button>
    </div>
  );
}
