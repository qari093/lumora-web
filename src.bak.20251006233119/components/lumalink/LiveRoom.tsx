"use client";
import React from "react";
import { getSocket } from "@/lib/lumalink-socket";

type PeerMap = Map<string, RTCPeerConnection>;

export default function LiveRoom({ roomId="main-room" }: { roomId?: string }) {
  const [ready, setReady] = React.useState(false);
  const [micOn, setMicOn] = React.useState(true);
  const [camOn, setCamOn] = React.useState(true);
  const [sharing, setSharing] = React.useState(false);
  const [iceServers, setIceServers] = React.useState<RTCIceServer[]>([{ urls: ["stun:stun.l.google.com:19302"] }]);

  const localVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const remoteVideosRef = React.useRef<Map<string, HTMLVideoElement>>(new Map());
  const streamRef = React.useRef<MediaStream | null>(null);
  const screenTrackRef = React.useRef<MediaStreamTrack | null>(null);
  const pcRef = React.useRef<PeerMap>(new Map());
  const socketRef = React.useRef(getSocket());
  const [peers, setPeers] = React.useState<string[]>([]);

  // Load ICE servers dynamically
  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/ice");
        const j = await r.json();
        if (Array.isArray(j?.iceServers) && j.iceServers.length) setIceServers(j.iceServers);
      } catch {}
    })();
  }, []);

  const ensurePC = (peerId: string) => {
    const ex = pcRef.current.get(peerId);
    if (ex) return ex;
    const pc = new RTCPeerConnection({ iceServers });
    const local = streamRef.current;
    if (local) local.getTracks().forEach((t) => pc.addTrack(t, local));
    pc.ontrack = (ev) => {
      const [remoteStream] = ev.streams;
      const el = remoteVideosRef.current.get(peerId);
      if (el) el.srcObject = remoteStream;
    };
    pc.onicecandidate = (ev) => {
      if (ev.candidate) socketRef.current.emit("signal-ice", { to: peerId, candidate: ev.candidate.toJSON() });
    };
    pcRef.current.set(peerId, pc);
    return pc;
  };

  const createOfferTo = async (peerId: string) => {
    const pc = ensurePC(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current.emit("signal-offer", { to: peerId, description: offer });
  };

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      await fetch("/api/lumalink").catch(()=>{});
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { width: 640, height: 360 } });
      streamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      socketRef.current.emit("join-room", { roomId });

      socketRef.current.on("room-users", (ids: string[]) => {
        if (!mounted) return;
        setPeers(ids);
        ids.forEach((id) => createOfferTo(id));
      });
      socketRef.current.on("user-joined", async (id: string) => {
        if (!mounted) return;
        setPeers((x) => Array.from(new Set([...x, id])));
        await createOfferTo(id);
      });
      socketRef.current.on("user-left", (id: string) => {
        setPeers((x) => x.filter((p) => p !== id));
        const pc = pcRef.current.get(id);
        if (pc) { pc.close(); pcRef.current.delete(id); }
        const el = remoteVideosRef.current.get(id);
        if (el) { el.srcObject = null as any; remoteVideosRef.current.delete(id); }
      });
      socketRef.current.on("signal-offer", async ({ from, description }) => {
        const pc = ensurePC(from);
        await pc.setRemoteDescription(new RTCSessionDescription(description));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketRef.current.emit("signal-answer", { to: from, description: answer });
      });
      socketRef.current.on("signal-answer", async ({ from, description }) => {
        const pc = ensurePC(from);
        await pc.setRemoteDescription(new RTCSessionDescription(description));
      });
      socketRef.current.on("signal-ice", async ({ from, candidate }) => {
        const pc = ensurePC(from);
        try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch {}
      });
      setReady(true);
    })();

    return () => {
      mounted = false;
      socketRef.current.off("room-users");
      socketRef.current.off("user-joined");
      socketRef.current.off("user-left");
      socketRef.current.off("signal-offer");
      socketRef.current.off("signal-answer");
      socketRef.current.off("signal-ice");
      streamRef.current?.getTracks().forEach(t => t.stop());
      pcRef.current.forEach((pc) => pc.close());
      pcRef.current.clear();
    };
  }, [roomId, iceServers]);

  const toggleMic = () => {
    const s = streamRef.current; if (!s) return;
    s.getAudioTracks().forEach(tr => tr.enabled = !tr.enabled);
    setMicOn(s.getAudioTracks()[0]?.enabled ?? false);
  };
  const toggleCam = () => {
    const s = streamRef.current; if (!s) return;
    s.getVideoTracks().forEach(tr => tr.enabled = !tr.enabled);
    setCamOn(s.getVideoTracks()[0]?.enabled ?? false);
  };
  const startScreen = async () => {
    if (sharing) return;
    const display = await (navigator.mediaDevices as any).getDisplayMedia({ video: true, audio: false });
    const track: MediaStreamTrack = display.getVideoTracks()[0];
    screenTrackRef.current = track;
    pcRef.current.forEach((pc) => {
      const senders = pc.getSenders().filter(s => s.track && s.track.kind === "video");
      if (senders[0]) senders[0].replaceTrack(track);
    });
    track.onended = () => stopScreen();
    setSharing(true);
  };
  const stopScreen = () => {
    if (!sharing) return;
    const orig = streamRef.current?.getVideoTracks()[0];
    pcRef.current.forEach((pc) => {
      const senders = pc.getSenders().filter(s => s.track && s.track.kind === "video");
      if (senders[0] && orig) senders[0].replaceTrack(orig);
    });
    screenTrackRef.current?.stop();
    screenTrackRef.current = null;
    setSharing(false);
  };

  return (
    <div style={{ display:"grid", gap:12 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div style={{ border:"1px solid #333", borderRadius:8, padding:8 }}>
          <div style={{ fontWeight:700, marginBottom:6 }}>You</div>
          <video ref={localVideoRef} autoPlay playsInline muted style={{ width:"100%", borderRadius:6, background:"#000" }} />
        </div>
        <div style={{ display:"grid", gap:8 }}>
          {peers.map((id) => (
            <div key={id} style={{ border:"1px solid #333", borderRadius:8, padding:8 }}>
              <div style={{ fontWeight:700, marginBottom:6, wordBreak:"break-all" }}>{id.slice(0,8)}…</div>
              <video
                ref={(el) => { if (el) remoteVideosRef.current.set(id, el); }}
                autoPlay playsInline style={{ width:"100%", borderRadius:6, background:"#000" }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
        <button onClick={toggleMic} style={btn(micOn)}>{micOn ? "Mute Mic" : "Unmute Mic"}</button>
        <button onClick={toggleCam} style={btn(camOn)}>{camOn ? "Turn Camera Off" : "Turn Camera On"}</button>
        {!sharing ? (
          <button onClick={startScreen} style={btn(true)}>Start Screenshare</button>
        ) : (
          <button onClick={stopScreen} style={btn(true)}>Stop Screenshare</button>
        )}
      </div>

      {!ready && <div style={{ textAlign:"center" }}>Initializing media & signaling…</div>}
    </div>
  );
}

function btn(active:boolean):React.CSSProperties{
  return {
    padding:"10px 14px",
    borderRadius:10,
    border:"1px solid #333",
    background: active ? "linear-gradient(180deg,#22c55e,#16a34a)" : "#111827",
    color: active ? "#0b0f12" : "#e5e7eb",
    fontWeight:800,
    cursor:"pointer"
  };
}
