// app/cf-upload/page.tsx
"use client";
import React from "react";

export default function CFUploadPage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState("Pick an image and click Upload.");

  async function onUpload() {
    if (!file) { setStatus("Please choose a file first."); return; }
    setStatus("Uploading…");
    const fd = new FormData();
    fd.append("file", file, file.name || "upload.png");
    try {
      const res = await fetch("/api/cf/images", { method: "POST", body: fd });
      const json = await res.json();
      if (json.ok) {
        const id = json?.cf?.result?.id;
        setStatus(`✅ Uploaded! Image ID: ${id || "(unknown)"}`);
      } else {
        setStatus(`❌ ${json.error || "Upload failed"}`);
      }
    } catch (e: any) {
      setStatus(`❌ ${e?.message || "Network error"}`);
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Arial" }}>
      <h1 style={{ fontWeight: 800, marginBottom: 12 }}>Cloudflare Images — Test Upload</h1>
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={onUpload} style={{ marginLeft: 12, padding: "8px 14px", borderRadius: 10 }}>
        Upload
      </button>
      <p style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{status}</p>
    </main>
  );
}
