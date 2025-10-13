"use client";

import React, { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  async function getUploadUrl() {
    const r = await fetch("/api/videos/upload-token", {
      method: "POST",
      headers: { "Accept": "application/json" },
      cache: "no-store",
    });
    const json = await r.json();
    if (!json?.ok) throw new Error(json?.error || "upload-token failed");
    return json.upload?.uploadURL as string;
  }

  async function onUpload() {
    try {
      if (!file) { alert("Select a video first"); return; }
      setUploading(true);
      setStatus("Requesting upload URL…");
      const uploadURL = await getUploadUrl();

      const form = new FormData();
      form.append("file", file, file.name);

      setStatus("Uploading to Cloudflare Stream…");
      const r = await fetch(uploadURL, { method: "POST", body: form });
      const json = await r.json();
      if (!r.ok || !json?.result?.id) {
        console.error(json);
        throw new Error("Direct upload failed");
      }

      // Cloudflare will process & then call our webhook -> DB
      setStatus(`Uploaded. CF UID: ${json.result.id}. Processing… (check /videos after a few sec)`);
    } catch (e: any) {
      setStatus(`❌ ${e.message || e}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <main style={{maxWidth: 720, margin: "40px auto", padding: 16}}>
      <h1>Upload a Video</h1>
      <p>Select a short clip (<= 3 minutes per our limit).</p>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <div style={{marginTop: 12}}>
        <button onClick={onUpload} disabled={!file || uploading}>
          {uploading ? "Uploading…" : "Upload to Cloudflare Stream"}
        </button>
      </div>
      {status && <pre style={{marginTop: 16, background:"#111", color:"#0f0", padding:12, whiteSpace:"pre-wrap"}}>{status}</pre>}
      <div style={{marginTop: 24}}>
        <a href="/videos" style={{textDecoration:"underline"}}>Go to Videos list →</a>
      </div>
    </main>
  );
}
