"use client";
import { useEffect, useState } from "react";

export default function AdminPayouts() {
  const [rows, setRows] = useState<any[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/rooms");
    if (res.ok) {
      const data = await res.json();
      setRows(data.rooms || []);
    }
  }

  async function settle(slug: string) {
    setBusy(slug);
    await fetch("/api/admin/settle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: slug })
    });
    setBusy(null);
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding:20 }}>
      <h2>⚖️ Admin Payouts</h2>
      <table style={{ width:"100%", marginTop:16, borderCollapse:"collapse" }}>
        <thead>
          <tr style={{ textAlign:"left" }}>
            <th style={{ padding:8 }}>Room</th>
            <th style={{ padding:8 }}>Created</th>
            <th style={{ padding:8 }}>Gifts</th>
            <th style={{ padding:8 }}>Value</th>
            <th style={{ padding:8 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.slug}>
              <td style={{ padding:8 }}>{r.slug}</td>
              <td style={{ padding:8 }}>{r.createdAt}</td>
              <td style={{ padding:8, textAlign:"right" }}>{r.gifts}</td>
              <td style={{ padding:8, textAlign:"right" }}>{r.value}</td>
              <td style={{ padding:8, textAlign:"right" }}>
                <button disabled={busy===r.slug} onClick={()=>settle(r.slug)}>
                  {busy===r.slug ? "Settling…" : "Settle"}
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding:16, opacity:.7 }}>
                No rooms yet — open <a href="/live/main-room">/live/main-room</a> and send a gift.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
