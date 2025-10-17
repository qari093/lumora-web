"use client";
import React from "react";

export default function UploadPage(){
  const [file, setFile] = React.useState<File | null>(null);
  const [key, setKey] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<string>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFile(e.target.files?.[0] ?? null);
    setKey(null);
    setError(null);
  };

  const upload = async () => {
    if (!file) return;
    setStatus("signing"); setError(null);
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    const r = await fetch("/api/storage/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType: file.type, ext, prefix: "uploads" }),
    });
    const data = await r.json();
    if (!r.ok) { setError(data.error || "sign_failed"); setStatus("idle"); return; }

    setStatus("uploading");
    const put = await fetch(data.url, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
    if (!put.ok) { setError("upload_failed"); setStatus("idle"); return; }

    // Enqueue for moderation
    await fetch("/api/moderation/create", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ kind: "IMAGE", objectKey: data.key })
    });

    setKey(data.key);
    setStatus("done");
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>📤 Signed Upload (S3-compatible) + Moderation</h1>
      <input type="file" onChange={onPick} />
      <div style={{ marginTop: 12 }}>
        <button onClick={upload} disabled={!file || status==="uploading" || status==="signing"} style={btn()}>
          {status==="signing" ? "Signing…" : status==="uploading" ? "Uploading…" : "Upload"}
        </button>
        {error && <span style={{ marginLeft: 12, color: "#ef4444" }}>{error}</span>}
      </div>
      {key && (
        <div style={{ marginTop: 16 }}>
          <div>Key: <code>{key}</code></div>
          <div style={{ marginTop: 8 }}>
            Preview:
            <div style={{ marginTop: 8, border:"1px solid #333", borderRadius:8, padding:8, maxWidth:480 }}>
              <img alt="preview" src={`/api/storage/proxy?key=${encodeURIComponent(key)}`} style={{ maxWidth: "100%", borderRadius: 6 }} />
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            Added to <a href="/moderation">Moderation Queue</a>.
          </div>
        </div>
      )}
    </div>
  );
}

function btn(): React.CSSProperties {
  return { padding:"10px 14px", borderRadius:10, border:"1px solid #333", background:"linear-gradient(180deg,#22c55e,#16a34a)", color:"#0b0f12", fontWeight:800, cursor:"pointer" };
}
