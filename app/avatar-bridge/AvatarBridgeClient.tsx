"use client";

import { useState } from "react";
import s from "./bridge.module.css";

export const dynamic = "force-dynamic";

export default function AvatarBridge() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onChoose(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setMsg(null);
    setAvatarUrl(null);
    setUploadId(null);
    setFileUrl(URL.createObjectURL(f));

    const body = new FormData();
    body.append("photo", f);
    setBusy(true);
    try {
      const res = await fetch("/api/hybrid/avatar/upload", { method: "POST", body });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "upload failed");
      setUploadId(j.id);
    } catch (err: any) {
      setMsg(err?.message || "upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function onTransform() {
    if (!uploadId) return;
    setBusy(true);
    setMsg(null);
    try {
      const url = `/api/hybrid/avatar/transform?uploadId=${encodeURIComponent(uploadId)}&size=220`;
      const svg = await fetch(url, { cache: "no-store" }).then(r => r.text());
      const data = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
      setAvatarUrl(data);
    } catch (err: any) {
      setMsg(err?.message || "transform failed");
    } finally {
      setBusy(false);
    }
  }

  function onDownload() {
    if (!avatarUrl) return;
    const a = document.createElement("a");
    a.href = avatarUrl;
    a.download = `lumora-avatar-${uploadId || "preview"}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className={s.wrap}>
      <h1 className={s.h1}>Pic-to-Avatar Bridge</h1>

      <div className={s.row}>
        <div className={s.card} style={{maxWidth:480}}>
          <div className={s.label}>1) Choose photo</div>
          <input type="file" accept="image/*" onChange={onChoose} disabled={busy}/>
          {fileUrl && <img className={s.img} src={fileUrl} alt="chosen" />}
          {uploadId && <div className={s.meta}>uploadId: {uploadId}</div>}
        </div>

        <div className={s.card} style={{maxWidth:420}}>
          <div className={s.label}>2) Transform → Download</div>
          <div style={{display:"flex", gap:8, marginBottom:10}}>
            <button className={s.btn} onClick={onTransform} disabled={busy || !uploadId}>Transform</button>
            <button className={s.btn} onClick={onDownload} disabled={!avatarUrl}>Download</button>
          </div>
          {avatarUrl ? <img className={s.img} src={avatarUrl} alt="avatar" /> : <div className={s.meta}>No avatar yet</div>}
        </div>
      </div>

      {msg && <div className={s.meta} style={{color:"#f88"}}>{msg}</div>}
    </div>
  );
}
