"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Overview = {
  ok: boolean;
  windowMinutes: number;
  wallets: { count: number; totalCents: number };
  campaigns: number;
  kycPending: number;
  activity: { eventsLastHr: number; convLastHr: number; fraudLastHr: number };
  error?: string;
};

type ApiError = { ok?: false; error?: string };

const money = (cents: number) => `€${(cents / 100).toFixed(2)}`;

function getAdminTokenSafe(): string {
  try {
    if (typeof window === "undefined") return "dev-admin-token";
    return localStorage.getItem("adminToken") || "dev-admin-token";
  } catch {
    return "dev-admin-token";
  }
}

async function fetchJson<T>(
  url: string,
  opts: { headers?: Record<string, string>; timeoutMs?: number; signal?: AbortSignal } = {}
): Promise<T> {
  const { headers, timeoutMs = 12_000, signal } = opts;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  // Merge external + internal abort signals
  const anySignal = (() => {
    if (!signal) return ctrl.signal;
    if (signal.aborted) return signal;
    const chained = new AbortController();
    const onAbort = () => chained.abort();
    signal.addEventListener("abort", onAbort, { once: true });
    ctrl.signal.addEventListener("abort", onAbort, { once: true });
    return chained.signal;
  })();

  try {
    const res = await fetch(url, {
      headers,
      cache: "no-store",
      signal: anySignal,
    });

    const text = await res.text();
    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = { ok: false, error: "invalid_json" } satisfies ApiError;
    }

    if (!res.ok) {
      const errMsg =
        (json && typeof json === "object" && (json.error as string)) ||
        `http_${res.status}`;
      throw new Error(errMsg);
    }

    return json as T;
  } finally {
    clearTimeout(t);
  }
}

export default function AdminHome() {
  const [o, setO] = useState<Overview | null>(null);
  const [msg, setMsg] = useState<string>("");
  const [token, setToken] = useState<string>("dev-admin-token");
  const [tokenDraft, setTokenDraft] = useState<string>("dev-admin-token");
  const [busy, setBusy] = useState<boolean>(false);

  const alive = useRef(true);
  const reqSeq = useRef(0);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // Load token from localStorage on mount (client-safe)
  useEffect(() => {
    const t = getAdminTokenSafe();
    setToken(t);
    setTokenDraft(t);
  }, []);

  const headers = useMemo(() => ({ "x-admin-token": token }), [token]);

  const applyToken = useCallback(() => {
    const next = (tokenDraft || "").trim() || "dev-admin-token";
    setToken(next);
    try {
      localStorage.setItem("adminToken", next);
    } catch {
      // ignore
    }
    setMsg("Token updated.");
  }, [tokenDraft]);

  const load = useCallback(async () => {
    const mySeq = ++reqSeq.current;
    setBusy(true);
    setMsg("Loading…");
    try {
      const ov = await fetchJson<Overview>("/api/admin/overview", { headers, timeoutMs: 15_000 });
      if (!alive.current || mySeq !== reqSeq.current) return;

      if (ov?.ok) {
        setO(ov);
        setMsg("");
      } else {
        setO(null);
        setMsg((ov as ApiError)?.error || "Failed");
      }
    } catch (e: any) {
      if (!alive.current || mySeq !== reqSeq.current) return;
      setO(null);
      setMsg(typeof e?.message === "string" ? e.message : String(e));
    } finally {
      if (!alive.current || mySeq !== reqSeq.current) return;
      setBusy(false);
    }
  }, [headers]);

  const health = useCallback(async () => {
    const mySeq = ++reqSeq.current;
    setBusy(true);
    setMsg("Pinging DB…");
    try {
      const r = await fetchJson<{ ok: boolean; error?: string }>("/api/admin/health", {
        headers,
        timeoutMs: 10_000,
      });
      if (!alive.current || mySeq !== reqSeq.current) return;
      setMsg(r?.ok ? "DB OK" : r?.error || "Health failed");
    } catch (e: any) {
      if (!alive.current || mySeq !== reqSeq.current) return;
      setMsg(typeof e?.message === "string" ? e.message : String(e));
    } finally {
      if (!alive.current || mySeq !== reqSeq.current) return;
      setBusy(false);
    }
  }, [headers]);

  useEffect(() => {
    void load();
  }, [load]);

  const statusColor = msg.toLowerCase().includes("fail") || msg.toLowerCase().includes("error") ? "#b00020" : "#0a7";

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "24px auto",
        padding: "0 16px",
        fontFamily: "ui-sans-serif, system-ui",
      }}
    >
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Admin Panel</h1>

      <div style={{ marginTop: 8, color: "#666", fontSize: 13, lineHeight: 1.5 }}>
        Token comes from <code>localStorage.adminToken</code>. Default is <code>dev-admin-token</code>.
      </div>

      <div style={{ display: "flex", gap: 8, margin: "12px 0", flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={load} style={{ ...btn, opacity: busy ? 0.7 : 1 }} disabled={busy}>
          Reload
        </button>
        <button onClick={health} style={{ ...btn, opacity: busy ? 0.7 : 1 }} disabled={busy}>
          Health Check
        </button>

        <Link href="/admin/kyc" style={{ ...btn, textDecoration: "none" }}>
          KYC Queue
        </Link>
        <Link href="/brand/insights" style={{ ...btn, textDecoration: "none" }}>
          Brand Insights
        </Link>
        <Link href="/vendor" style={{ ...btn, textDecoration: "none" }}>
          Vendor
        </Link>
        <Link href="/brand/eco" style={{ ...btn, textDecoration: "none" }}>
          Eco
        </Link>
      </div>

      <div style={{ ...card, marginTop: 10 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ minWidth: 220 }}>
            <div style={label}>Admin Token</div>
            <input
              value={tokenDraft}
              onChange={(e) => setTokenDraft(e.target.value)}
              placeholder="admin token"
              spellCheck={false}
              style={input}
            />
          </div>
          <button onClick={applyToken} style={btn}>
            Apply Token
          </button>
          <div style={{ fontSize: 12, color: "#666" }}>
            Active: <code>{token}</code>
          </div>
        </div>
      </div>

      {msg && (
        <div style={{ margin: "10px 0", color: statusColor, fontSize: 13 }}>
          {busy ? "⏳ " : ""}
          {msg}
        </div>
      )}

      {o && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginTop: 12 }}>
            <div style={card}>
              <div style={label}>Wallets</div>
              <div style={val}>{o.wallets.count}</div>
            </div>
            <div style={card}>
              <div style={label}>Total Balance</div>
              <div style={val}>{money(o.wallets.totalCents)}</div>
            </div>
            <div style={card}>
              <div style={label}>Campaigns</div>
              <div style={val}>{o.campaigns}</div>
            </div>
            <div style={card}>
              <div style={label}>KYC Pending</div>
              <div style={val}>{o.kycPending}</div>
            </div>
            <div style={card}>
              <div style={label}>Events (1h)</div>
              <div style={val}>{o.activity.eventsLastHr}</div>
            </div>
            <div style={card}>
              <div style={label}>Conversions (1h)</div>
              <div style={val}>{o.activity.convLastHr}</div>
            </div>
          </div>

          <div style={{ ...card, marginTop: 16 }}>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".06em", color: "#666" }}>
              Fraud (1h)
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{o.activity.fraudLastHr}</div>
          </div>
        </>
      )}
    </div>
  );
}

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 10,
  padding: "12px 14px",
};

const label: React.CSSProperties = {
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: ".06em",
  color: "#666",
};

const val: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  marginTop: 4,
};

const btn: React.CSSProperties = {
  padding: "8px 12px",
  border: "1px solid #ddd",
  borderRadius: 8,
  background: "#fff",
  cursor: "pointer",
  color: "inherit",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #ddd",
  borderRadius: 8,
  outline: "none",
  fontSize: 13,
};