"use client";
// --- QM: safe window/((typeof window!=='undefined'&&window.localStorage)||{}) guards ---
function qmHasWindow(){ return typeof window !== "undefined"; }
function qmGetLS(k,def=null){ try{ if(!qmHasWindow()) return def; const v=window.qmGetLS(k); return v===null?def:v; }catch{return def;} }
function qmSetLS(k,v){ try{ if(qmHasWindow()) qmSetLS(k,v); }catch{} }
// --- end guards ---
import React, { useEffect, useRef, useState } from "react";

const box: React.CSSProperties = {
  position: "fixed",
  bottom: 360,
  left: 12,
  zIndex: 2147483000,
  background: "rgba(18,18,26,.78)",
  backdropFilter: "blur(10px)",
  color: "#fff",
  padding: "10px 12px",
  borderRadius: 12,
  font: "12px system-ui",
  boxShadow: "0 6px 22px rgba(0,0,0,.35)",
  minWidth: 240,
  maxWidth: 280,
};

const btn: React.CSSProperties = {
  border: "1px solid #777",
  background: "transparent",
  color: "#fff",
  borderRadius: 8,
  padding: "4px 8px",
  cursor: "pointer",
  fontWeight: 700,
};

const encAlgo = "AES-GCM";
const encLen = 256;

function te(x: string) { return new TextEncoder().encode(x); }
function td(b: ArrayBuffer) { return new TextDecoder().decode(b); }
function b64e(buf: ArrayBuffer) { return btoa(String.fromCharCode(...new Uint8Array(buf))); }
function b64d(b64: string) { return Uint8Array.from(atob(b64), c => c.charCodeAt(0)); }

async function derive(pass: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey("raw", te(pass), { name: "PBKDF2" }, false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    { name: encAlgo, length: encLen },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encrypt(pass: string, data: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await derive(pass, salt);
  const cipher = await crypto.subtle.encrypt({ name: encAlgo, iv }, key, te(data));
  return { salt: Array.from(salt), iv: Array.from(iv), cipherB64: b64e(cipher) };
}

async function decrypt(pass: string, saltArr: number[], ivArr: number[], b64: string) {
  const salt = new Uint8Array(saltArr);
  const iv = new Uint8Array(ivArr);
  const key = await derive(pass, salt);
  const plain = await crypto.subtle.decrypt({ name: encAlgo, iv }, key, b64d(b64));
  return td(plain);
}

type MirrorBlob = {
  version: 1;
  ts: number;
  ua: string;
  entries: Record<string,string|null>;
  counts: Record<string, number>;
};

function collectSnapshot(): MirrorBlob {
  const entries: Record<string,string|null> = {};
  const keys = Object.keys(((typeof window!=='undefined'&&window.localStorage)||{}));
  for (const k of keys) {
    try { entries[k] = qmGetLS(k); }
    catch { entries[k] = null; }
  }
  const counts: Record<string, number> = {};
  const buckets = ["metrics:", "batch:", "predict:", "delta:", "offline:rewards", "orderhash:", "statecapsule:", "offline:manifest"];
  for (const b of buckets) counts[b] = keys.filter(k => b === "offline:rewards" ? k === "offline:rewards" : k.startsWith(b)).length;
  return { version: 1, ts: Date.now(), ua: navigator.userAgent, entries, counts };
}

// IndexedDB mini helper
function openDB(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const req = indexedDB.open("lumora-mirror", 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("snapshots")) db.createObjectStore("snapshots", { keyPath: "id" });
    };
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}
function putSnapshot(rec: any): Promise<void> {
  return openDB().then(db => new Promise((res, rej) => {
    const tx = db.transaction("snapshots", "readwrite");
    tx.objectStore("snapshots").put(rec);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  }));
}
function getSnapshot(id: string): Promise<any|null> {
  return openDB().then(db => new Promise((res, rej) => {
    const tx = db.transaction("snapshots", "readonly");
    const rq = tx.objectStore("snapshots").get(id);
    rq.onsuccess = () => res(rq.result || null);
    rq.onerror = () => rej(rq.error);
  }));
}
function listSnapshots(limit=5): Promise<any[]> {
  return openDB().then(db => new Promise((res, rej) => {
    const tx = db.transaction("snapshots","readonly");
    const store = tx.objectStore("snapshots");
    const out: any[] = [];
    const req = store.openCursor(null, "prev");
    req.onsuccess = () => {
      const cur = req.result as IDBCursorWithValue | null;
      if (!cur || out.length >= limit) { res(out); return; }
      out.push(cur.value);
      cur.continue();
    };
    req.onerror = () => rej(req.error);
  }));
}

function restoreSnapshot(blob: MirrorBlob) {
  const keys = Object.keys(blob.entries);
  let written = 0;
  for (const k of keys) {
    const v = blob.entries[k];
    if (typeof v === "string") {
      try { qmSetLS(k, v); written++; } catch {}
    }
  }
  return written;
}

function fileSave(name: string, text: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  a.download = name;
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  a.click();
}

export default function QuantumMirror() {
  const [busy, setBusy] = useState<string|false>(false);
  const [last, setLast] = useState<string>("idle");
  const [list, setList] = useState<any[]>([]);
  const passRef = useRef<HTMLInputElement|null>(null);

  const refreshList = async () => setList(await listSnapshots(5));

  useEffect(() => { refreshList(); }, []);

  const getPass = () => (passRef.current?.value || qmGetLS("mirror:pass") || "");

  const backup = async () => {
    try {
      setBusy("Working…");
      const pass = getPass();
      if (!pass) { alert("Set a passphrase first."); setBusy(false); return; }
      qmSetLS("mirror:pass", pass);
      const snap = collectSnapshot();
      const plain = JSON.stringify(snap);
      const enc = await encrypt(pass, plain);
      const rec = { id: String(Date.now()), ...enc };
      await putSnapshot(rec);
      setLast(`backup • ${Object.keys(snap.entries).length} keys`);
      await refreshList();
    } catch (e:any) {
      setLast("error"); console.error(e);
    } finally { setBusy(false); }
  };

  const restore = async (id?: string) => {
    try {
      setBusy("Restoring…");
      const pass = getPass();
      if (!pass) { alert("Enter your passphrase."); setBusy(false); return; }
      const rec = await getSnapshot(id || (list[0]?.id as string));
      if (!rec) { alert("No snapshot found."); setBusy(false); return; }
      const plain = await decrypt(pass, rec.salt, rec.iv, rec.cipherB64);
      const blob: MirrorBlob = JSON.parse(plain);
      const written = restoreSnapshot(blob);
      setLast(`restore • wrote ${written} keys`);
      // Notify systems to re-read local state
      window.dispatchEvent(new Event("lumora:state-restored"));
    } catch (e:any) {
      setLast("error"); console.error(e);
    } finally { setBusy(false); }
  };

  const exportFile = async () => {
    try {
      setBusy("Exporting…");
      const top = await getSnapshot(list[0]?.id || "");
      if (!top) { alert("Nothing to export"); setBusy(false); return; }
      fileSave(`lumora-mirror-${top.id}.json`, JSON.stringify(top));
      setLast("exported");
    } finally { setBusy(false); }
  };

  const importFile = async (file: File) => {
    try {
      setBusy("Importing…");
      const text = await file.text();
      const rec = JSON.parse(text);
      if (!rec || !rec.id || !rec.cipherB64) throw new Error("Invalid file");
      await putSnapshot(rec);
      await refreshList();
      setLast("imported");
    } catch (e:any) {
      setLast("error"); console.error(e);
    } finally { setBusy(false); }
  };

  return (
    <div style={box} title="Quantum Mirror Backup (encrypted IndexedDB)">
      <div style={{ fontWeight: 800, marginBottom: 6 }}>Quantum Mirror</div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
        <span>Pass</span>
        <input ref={passRef} type="password" placeholder="••••••" style={{ flex: 1, padding: "4px 6px", borderRadius: 8, border: "1px solid #666", background: "rgba(255,255,255,.06)", color: "#fff" }} defaultValue={qmGetLS("mirror:pass") || ""} />
      </div>
      <div style={{ opacity: .85, marginBottom: 6 }}>Last: <b>{last}</b></div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button style={btn as any} onClick={backup}>{busy || "Backup"}</button>
        <button style={{ ...btn, borderColor: "transparent", background: "#0b8" }} onClick={()=>restore()}>Restore</button>
        <button style={btn as any} onClick={exportFile}>Export</button>
        <label style={{ ...btn, display: "inline-block" }}>
          Import
          <input type="file" accept="application/json" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) importFile(f); }} />
        </label>
      </div>
      <div style={{ marginTop: 8, opacity: .85 }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>Recent</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {list.map((r:any) => (
            <button key={r.id} style={{ ...btn, padding: "2px 6px", fontWeight: 600 }} onClick={()=>restore(r.id)} title={`Restore ${r.id}`}>{r.id.slice(-6)}</button>
          ))}
          {!list.length && <span style={{ opacity: .7 }}>—</span>}
        </div>
      </div>
    </div>
  );
}
