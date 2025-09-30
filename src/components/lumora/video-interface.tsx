"use client";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function VideoInterface() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [room] = useState("main-room");
  const [balance, setBalance] = useState(650);
  const [camOn, setCamOn] = useState(false);
  const [micOn, setMicOn] = useState(false);

  useEffect(() => {
    try {
      const s = io("http://localhost:4000", { transports: ["websocket"] });
      socketRef.current = s;
      s.on("connect", () => console.log("[Live] connected", s.id));
      s.on("disconnect", () => console.log("[Live] disconnected"));
      return () => { try { s.disconnect(); } catch {} };
    } catch {}
  }, []);

  async function startMedia() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamOn(true);
      setMicOn(true);
    } catch (e) {
      console.error("getUserMedia failed:", e);
      alert("Camera/Mic permission needed.");
    }
  }

  function stopMedia() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setCamOn(false);
    setMicOn(false);
  }

  function toggleCam() {
    const s = streamRef.current;
    if (!s) return;
    s.getVideoTracks().forEach(t => (t.enabled = !t.enabled));
    setCamOn(v => !v);
  }

  function toggleMic() {
    const s = streamRef.current;
    if (!s) return;
    s.getAudioTracks().forEach(t => (t.enabled = !t.enabled));
    setMicOn(v => !v);
  }

  function sendGift() {
    setBalance(b => b + 10);
    try { socketRef.current?.emit("sendGift", { room, type: "Sparkle", value: 10 }); } catch {}
    flashEmoji("✨");
  }

  function flashEmoji(e: string) {
    const el = document.createElement("div");
    el.textContent = e;
    Object.assign(el.style, {
      position: "fixed", left: "50%", top: "50%",
      transform: "translate(-50%,-50%)",
      fontSize: "64px", pointerEvents: "none",
      animation: "pop 1.4s ease-out forwards", zIndex: "9999"
    } as CSSStyleDeclaration);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }

  return (
    <div style={{ padding: 16, color: "#e5e7eb", fontFamily: "Inter, system-ui, sans-serif" }}>
      <h2 style={{ margin: "0 0 12px 0" }}>�� Room: {room}</h2>
      <div style={{ margin: "6px 0 12px 0" }}>💰 Balance: <b>{balance} ZC</b></div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(280px, 1fr)",
        gap: 12,
        background: "#0b0f19",
        border: "1px solid #1f2937",
        borderRadius: 12,
        padding: 12,
        minHeight: 280
      }}>
        <video ref={videoRef} muted playsInline style={{ width: "100%", background: "#000", borderRadius: 8 }} />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        <button onClick={startMedia} style={btn}>🎥 Start</button>
        <button onClick={stopMedia} style={btn}>⏹ Stop</button>
        <button onClick={toggleCam} disabled={!streamRef.current} style={btn}>{camOn ? "🙈 Cam Off" : "📷 Cam On"}</button>
        <button onClick={toggleMic} disabled={!streamRef.current} style={btn}>{micOn ? "🔇 Mute" : "🎙 Unmute"}</button>
        <button onClick={sendGift} style={btn}>�� Send Gift (+10 ZC)</button>
      </div>

      <style>{`
        @keyframes pop {
          0% { transform: translate(-50%,-50%) scale(0.7); opacity: 0; }
          50% { transform: translate(-50%,-60%) scale(1); opacity: 1; }
          100% { transform: translate(-50%,-80%) scale(1.1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

const btn: React.CSSProperties = {
  background: "linear-gradient(45deg,#667eea,#764ba2)",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600
};
