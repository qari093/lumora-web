"use client";
import React from "react";
import { getSocket } from "../_lib/socket";

type Tile = { id: string; label: string; stream?: MediaStream; muted?: boolean; camera?: boolean; isLocal?: boolean };

function uuid() { return Math.random().toString(36).slice(2,10); }

export default function LumaLinkRoom() {
  const [roomId, setRoomId] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      const u = new URLSearchParams(window.location.search);
      return u.get("room") || "demo-room";
    }
    return "demo-room";
  });

  const [selfId] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      const u = new URLSearchParams(window.location.search);
      return u.get("uid") || "user-"+uuid();
    }
    return "user-"+uuid();
  });

  const [tiles, setTiles] = React.useState<Tile[]>([]);
  const [micOn, setMicOn] = React.useState(true);
  const [camOn, setCamOn] = React.useState(true);
  const [sharing, setSharing] = React.useState(false);
  const localRef = React.useRef<HTMLVideoElement>(null);
  const [status, setStatus] = React.useState<"ready"|"in-room"|"error">("ready");
  const cleanups = React.useRef<(() => void)[]>([]);

  const addCleanup = (fn: ()=>void) => cleanups.current.push(fn);
  const stopAll = () => { cleanups.current.splice(0).forEach(fn=>{ try{ fn(); }catch{} }); };

  const attach = (el: HTMLVideoElement | null, ms?: MediaStream) => {
    if (!el) return;
    // @ts-ignore
    el.srcObject = ms || null;
    void el.play?.().catch(()=>{});
  };

  async function startLocal(cam = true, mic = true) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: cam ? { width: {ideal: 1280}, height: {ideal: 720} } : false,
        audio: mic ? { echoCancellation: true, noiseSuppression: true } : false,
      });
      const me: Tile = { id: selfId, label: "You", stream, muted: !mic, camera: cam, isLocal: true };
      setTiles(t => {
        const others = t.filter(x => !x.isLocal);
        return [me, ...others];
      });
      attach(localRef.current, stream);
      addCleanup(()=>stream.getTracks().forEach(tr=>tr.stop()));
      return stream;
    } catch (e) {
      console.error("getUserMedia failed:", e);
      setStatus("error");
      return null;
    }
  }

  function setMic(enabled: boolean) {
    setMicOn(enabled);
    const me = tiles.find(t => t.isLocal)?.stream;
    me?.getAudioTracks().forEach(tr => tr.enabled = enabled);
    setTiles(arr => arr.map(t => t.isLocal ? {...t, muted: !enabled} : t));
  }
  function setCam(enabled: boolean) {
    setCamOn(enabled);
    const me = tiles.find(t => t.isLocal)?.stream;
    me?.getVideoTracks().forEach(tr => tr.enabled = enabled);
    setTiles(arr => arr.map(t => t.isLocal ? {...t, camera: enabled} : t));
  }

  async function toggleShare() {
    if (!sharing) {
      try {
        // @ts-ignore
        const ds: MediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        setSharing(true);
        const meTile = tiles.find(t => t.isLocal);
        if (meTile?.stream) {
          const camTracks = meTile.stream.getVideoTracks();
          const camTrack = camTracks[0];
          const shareTracks = ds.getVideoTracks();
          const shareTrack = shareTracks[0];
          if (camTrack && shareTrack) {
            meTile.stream.removeTrack(camTrack);
            meTile.stream.addTrack(shareTrack);
            attach(localRef.current, meTile.stream);
            shareTrack.onended = () => {
              meTile.stream?.removeTrack(shareTrack);
              if (camTrack) meTile.stream?.addTrack(camTrack);
              attach(localRef.current, meTile.stream || undefined);
              setSharing(false);
            };
          }
        }
        addCleanup(()=>ds.getTracks().forEach(tr=>tr.stop()));
      } catch (e) {
        console.warn("displayMedia failed", e);
      }
    }
  }

  async function join() {
    const s = await startLocal(true, true);
    if (!s) return;
    setStatus("in-room");

    const sock = getSocket();
    sock.emit("lumalink:room:join", { roomId, userId: selfId });

    sock.emit("lumalink:room:get-participants", { roomId });
    const timer = setTimeout(()=>{
      setTiles(t => {
        const me = t.find(x=>x.isLocal);
        const others: Tile[] = [
          { id: "alice", label: "Alice", camera: true, muted: false },
          { id: "bob", label: "Bob", camera: true, muted: true },
        ];
        return me ? [me, ...others] : t;
      });
    }, 800);
    addCleanup(()=>clearTimeout(timer));

    const onJoin = (p:{userId:string})=>{
      if (p.userId===selfId) return;
      setTiles(t => (t.some(x=>x.id===p.userId) ? t : [...t, { id:p.userId, label:p.userId, camera:true, muted:false }]));
    };
    const onLeave = (p:{userId:string})=>{
      setTiles(t => t.filter(x=>x.id!==p.userId));
    };
    sock.on("lumalink:room:joined", onJoin);
    sock.on("lumalink:room:left", onLeave);
    addCleanup(()=>{ sock.off("lumalink:room:joined", onJoin); sock.off("lumalink:room:left", onLeave); });
  }

  function leave() {
    const sock = getSocket();
    sock.emit("lumalink:room:leave", { roomId, userId: selfId });
    stopAll();
    setTiles([]);
    setMicOn(true);
    setCamOn(true);
    setSharing(false);
    setStatus("ready");
  }

  // Grid columns without template strings (avoid backticks)
  const colCount = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(Math.max(1, tiles.length)))));
  const gridStyle: React.CSSProperties = {
    display:"grid",
    gridTemplateColumns: "repeat(" + colCount + ", minmax(0,1fr))",
    gap:12,
    padding:12
  };

  return (
    <div style={{minHeight:"100dvh", background:"#0b0f12", color:"#fff", display:"flex", flexDirection:"column"}}>
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between",
                   padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,.10)", background:"rgba(255,255,255,.04)"}}>
        <div><strong>🎥 LumaLink Room</strong> — <span style={{opacity:.8}}>room:</span> {roomId}</div>
        <div style={{display:"flex", gap:8}}>
          {status==="ready" ? (
            <button onClick={join} style={btn(true)}>Join</button>
          ) : (
            <>
              <button onClick={()=>setMic(!micOn)} style={btn()}>{micOn?"Mute Mic":"Unmute Mic"}</button>
              <button onClick={()=>setCam(!camOn)} style={btn()}>{camOn?"Turn Cam Off":"Turn Cam On"}</button>
              <button onClick={toggleShare} style={btn()}>{sharing?"Stop Share":"Share Screen"}</button>
              <button onClick={leave} style={btn(false, true)}>Leave</button>
            </>
          )}
        </div>
      </div>

      <div style={gridStyle}>
        {tiles.filter(t=>t.isLocal).map(t => (
          <div key={t.id} style={tileStyle(t)}>
            <video ref={localRef} muted playsInline style={{width:"100%", height:"100%", objectFit:"cover", borderRadius:12, background:"#000"}} />
            <Badge t={t}/>
          </div>
        ))}
        {tiles.filter(t=>!t.isLocal).map(t => (
          <div key={t.id} style={tileStyle(t)}>
            <div style={{
              width:"100%", height:"100%", borderRadius:12,
              background:"linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.04))",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:900
            }}>
              {t.label.slice(0,2).toUpperCase()}
            </div>
            <Badge t={t}/>
          </div>
        ))}
      </div>

      <div style={{padding:"8px 16px", opacity:.7, fontSize:13}}>
        Tip: open two tabs like <code>?uid=alice&amp;room=demo-room</code> and <code>?uid=bob&amp;room=demo-room</code>.
      </div>
    </div>
  );
}

function tileStyle(t: Tile): React.CSSProperties {
  return {
    position:"relative",
    aspectRatio:"16 / 9",
    borderRadius:12,
    border:"1px solid rgba(255,255,255,.10)",
    overflow:"hidden",
    boxShadow:"0 8px 24px rgba(0,0,0,.35)"
  };
}
function Badge({ t }: { t: Tile }) {
  return (
    <div style={{
      position:"absolute", left:8, bottom:8,
      padding:"6px 10px", borderRadius:999,
      background:"rgba(0,0,0,.55)", border:"1px solid rgba(255,255,255,.15)", fontSize:12, fontWeight:800
    }}>
      {t.label} {t.muted ? "• 🔇" : ""} {t.camera===false ? "• 📷 off" : ""}
    </div>
  );
}
function btn(accent=false, danger=false): React.CSSProperties {
  return {
    padding:"8px 12px",
    borderRadius:10,
    border:"1px solid rgba(255,255,255,.20)",
    background: danger ? "rgba(244,63,94,.95)" : (accent ? "linear-gradient(180deg,#fbd34d,#d4a017)" : "rgba(255,255,255,.08)"),
    color: danger ? "#fff" : (accent ? "#111" : "#fff"),
    fontWeight:900,
    cursor:"pointer"
  };
}
