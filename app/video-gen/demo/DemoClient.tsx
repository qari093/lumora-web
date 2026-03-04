"use client";

import { useCallback, useMemo, useState } from "react";

type StatusResp =
  | { ok: false; error: string }
  | {
      ok: true;
      job: {
        jobId: string;
        status: "queued" | "running" | "done" | "failed";
        createdAt: number;
        updatedAt: number;
        durationSec: number;
        aspect: "9:16" | "16:9" | "1:1";
        resultUrl?: string;
        error?: string;
      };
    };

export default function VideoGenDemoPage() {
  const [prompt, setPrompt] = useState("A calm futuristic skyline with neon mist");
  const [durationSec, setDurationSec] = useState(6);
  const [aspect, setAspect] = useState<"9:16" | "16:9" | "1:1">("9:16");

  const [jobId, setJobId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");

  const base = useMemo(() => (typeof window !== "undefined" ? window.location.origin : ""), []);

  const submit = useCallback(async () => {
    setStatus("submitting...");
    setResultUrl("");
    setJobId("");

    const r = await fetch("/api/video-gen/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt, durationSec, aspect }),
    });

    const j = await r.json().catch(() => null);
    if (!r.ok || !j?.ok || !j?.jobId) {
      setStatus(`submit failed (${r.status}): ${j?.error || "unknown_error"}`);
      return;
    }

    setJobId(j.jobId);
    setStatus(`submitted: ${j.jobId}`);
  }, [prompt, durationSec, aspect]);

  const pollOnce = useCallback(async (id: string) => {
    const r = await fetch(`/api/video-gen/status?jobId=${encodeURIComponent(id)}`, { method: "GET" });
    const j = (await r.json().catch(() => null)) as StatusResp | null;

    if (!r.ok || !j) {
      setStatus(`status failed (${r.status})`);
      return;
    }
    if (!j.ok) {
      setStatus(`status error: ${j.error}`);
      return;
    }

    setStatus(`status: ${j.job.status}`);
    if (j.job.status === "done" && j.job.resultUrl) {
      setResultUrl(j.job.resultUrl.startsWith("http") ? j.job.resultUrl : `${base}${j.job.resultUrl}`);
    }
  }, [base]);

  const poll = useCallback(async () => {
    if (!jobId) {
      setStatus("no jobId yet");
      return;
    }
    setStatus("polling...");
    await pollOnce(jobId);
  }, [jobId, pollOnce]);

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>Video Gen Demo</h1>
      <p style={{ opacity: 0.8 }}>
        Guarded by feature flag. Generates a deterministic mock result URL in test phase.
      </p>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ opacity: 0.9 }}>Prompt</span>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,.18)", background: "rgba(0,0,0,.2)" }}
          />
        </label>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ opacity: 0.9 }}>Duration (sec)</span>
            <input
              type="number"
              min={1}
              max={120}
              value={durationSec}
              onChange={(e) => setDurationSec(Number(e.target.value))}
              style={{ width: 140, padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,.18)", background: "rgba(0,0,0,.2)" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ opacity: 0.9 }}>Aspect</span>
            <select
              value={aspect}
              onChange={(e) => setAspect(e.target.value as any)}
              style={{ width: 160, padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,.18)", background: "rgba(0,0,0,.2)" }}
            >
              <option value="9:16">9:16</option>
              <option value="16:9">16:9</option>
              <option value="1:1">1:1</option>
            </select>
          </label>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={submit}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,.22)", background: "rgba(255,255,255,.06)" }}
          >
            Submit
          </button>
          <button
            onClick={poll}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,.22)", background: "rgba(255,255,255,.06)" }}
          >
            Poll Status
          </button>
        </div>

        <div style={{ marginTop: 4, padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,.14)", background: "rgba(0,0,0,.18)" }}>
          <div><b>Job:</b> {jobId || "—"}</div>
          <div><b>Status:</b> {status || "—"}</div>
          <div><b>Result:</b> {resultUrl ? <a href={resultUrl} target="_blank" rel="noreferrer">{resultUrl}</a> : "—"}</div>
        </div>
      </div>
    </main>
  );
}
