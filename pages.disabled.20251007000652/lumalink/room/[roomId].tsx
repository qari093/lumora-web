import React, { useEffect, useMemo, useRef, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { safeStr } from "../../../lib/lumalink/util";

type Role = "host"|"guest";
const SIGNAL_URL = "/api/lumalink/signal";

function waitForIceGathering(pc: RTCPeerConnection): Promise<void> {
  if (pc.iceGatheringState === "complete") return Promise.resolve();
  return new Promise((resolve) => {
    function check() {
      if (pc.iceGatheringState === "complete") {
        pc.removeEventListener("icegatheringstatechange", check);
        resolve();
      }
    }
    pc.addEventListener("icegatheringstatechange", check);
  });
}

const btnStyle: React.CSSProperties = {
  padding:"10px 14px", borderRadius:10, border:"1px solid #111", background:"#111", color:"#fff", cursor:"pointer"
};

const RoomPage: NextPage = () => {
  const router = useRouter();
  const roomId = useMemo(() => safeStr(String(router.query.roomId ?? "")), [router.query.roomId]);
  const role = (router.query.role as Role) || ("guest" as Role);

  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);

  const [status, setStatus] = useState("Idle");
  const [chatMsg, setChatMsg] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    let closed = false;
    let pc: RTCPeerConnection;
    let localStream: MediaStream;

    (async () => {
      try {
        setStatus("Requesting media…");
        localStream = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
        if (localVideo.current) {
          localVideo.current.srcObject = localStream;
          await (localVideo.current as HTMLVideoElement).play().catch(()=>{});
        }

        setStatus("Creating RTCPeerConnection…");
        pc = new RTCPeerConnection({ iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }] });
        pcRef.current = pc;

        localStream.getTracks().forEach(t => pc.addTrack(t, localStream));

        const remoteStream = new MediaStream();
        if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
        pc.addEventListener("track", (ev) => { ev.streams[0]?.getTracks().forEach(tr => remoteStream.addTrack(tr)); });

        if (role === "host") {
          dcRef.current = pc.createDataChannel("chat");
          wireDataChannel(dcRef.current);
        } else {
          pc.addEventListener("datachannel", (e) => {
            dcRef.current = e.channel;
            wireDataChannel(dcRef.current);
          });
        }

        if (role === "host") {
          setStatus("Creating offer…");
          const offer = await pc.createOffer({ offerToReceiveAudio:true, offerToReceiveVideo:true });
          await pc.setLocalDescription(offer);
          await waitForIceGathering(pc);
          await fetch(SIGNAL_URL, {
            method:"POST", headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({ action:"saveOffer", roomId, sdp: pc.localDescription })
          });
          setStatus("Waiting for answer…");
          for (let i=0;i<60;i++){
            await new Promise(r=>setTimeout(r,1000));
            const res = await fetch(`${SIGNAL_URL}?roomId=${encodeURIComponent(roomId)}&action=getAnswer`);
            const data = await res.json().catch(()=>null);
            if (data?.answer) { await pc.setRemoteDescription(data.answer); setStatus("Connected (host)"); break; }
            if (closed) return;
          }
        } else {
          setStatus("Fetching offer…");
          for (let i=0;i<60;i++){
            const res = await fetch(`${SIGNAL_URL}?roomId=${encodeURIComponent(roomId)}&action=getOffer`);
            const data = await res.json().catch(()=>null);
            if (data?.offer) { await pc.setRemoteDescription(data.offer); break; }
            await new Promise(r=>setTimeout(r,1000));
            if (closed) return;
          }
          setStatus("Creating answer…");
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          await waitForIceGathering(pc);
          await fetch(SIGNAL_URL, {
            method:"POST", headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({ action:"saveAnswer", roomId, sdp: pc.localDescription })
          });
          setStatus("Connected (guest)");
        }
      } catch(e:any){
        console.error(e);
        setStatus(`Error: ${e?.message || e}`);
      }
    })();

    function wireDataChannel(dc: RTCDataChannel | null){
      if (!dc) return;
      dc.onmessage = (ev) => setChat((c)=>[...c, `Peer: ${String(ev.data)}`]);
      dc.onopen = () => setChat((c)=>[...c, "💡 Chat connected"]);
      dc.onclose = () => setChat((c)=>[...c, "⚠️ Chat disconnected"]);
      dc.onerror = () => setChat((c)=>[...c, "⚠️ Chat error"]);
    }

    return () => {
      closed = true;
      try { pcRef.current?.close(); } catch {}
      pcRef.current = null;
      try { (localVideo.current?.srcObject as MediaStream|null)?.getTracks().forEach(t=>t.stop()); } catch {}
    };
  }, [roomId, role]);

  async function sendMsg(){
    const m = safeStr(chatMsg);
    if (!m) return;
    dcRef.current?.send(m);
    setChat((c)=>[...c, `You: ${m}`]);
    setChatMsg("");
  }
  function toggleCam(){
    const s = localVideo.current?.srcObject as MediaStream | null; if(!s) return;
    s.getVideoTracks().forEach(t=>t.enabled=!t.enabled); setCamOn(v=>!v);
  }
  function toggleMic(){
    const s = localVideo.current?.srcObject as MediaStream | null; if(!s) return;
    s.getAudioTracks().forEach(t=>t.enabled=!t.enabled); setMicOn(v=>!v);
  }
  async function copyLink(){
    const link = `${location.origin}/lumalink/room/${encodeURIComponent(roomId)}?role=guest`;
    try { await navigator.clipboard.writeText(link); setLinkCopied(true); setTimeout(()=>setLinkCopied(false),1500); }
    catch { alert(link); }
  }

  if (!roomId) return <div style={{padding:24}}>Invalid room. <a href="/lumalink">Back</a></div>;

  return (
    <div style={{maxWidth:1100, margin:"16px auto", padding:"0 16px",
      fontFamily:"-apple-system, Inter, Segoe UI, Roboto, Helvetica, Arial"}}>
      <div style={{display:"flex", alignItems:"center", gap:12}}>
        <h2 style={{margin:"6px 0"}}>Room: {roomId}</h2>
        <span style={{padding:"4px 8px", border:"1px solid #ddd", borderRadius:8, fontSize:12}}>{role.toUpperCase()}</span>
        <span style={{marginLeft:"auto", fontSize:12, opacity:0.75}}>{status}</span>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
        <div style={{position:"relative", background:"#000", borderRadius:12, overflow:"hidden", minHeight:280}}>
          <video ref={localVideo} playsInline muted style={{width:"100%"}} />
          <div style={{position:"absolute", bottom:8, left:8, background:"rgba(0,0,0,0.5)", color:"#fff", padding:"2px 6px", borderRadius:6, fontSize:12}}>You</div>
        </div>
        <div style={{position:"relative", background:"#000", borderRadius:12, overflow:"hidden", minHeight:280}}>
          <video ref={remoteVideo} playsInline autoPlay style={{width:"100%"}} />
          <div style={{position:"absolute", bottom:8, left:8, background:"rgba(0,0,0,0.5)", color:"#fff", padding:"2px 6px", borderRadius:6, fontSize:12}}>Peer</div>
        </div>
      </div>

      <div style={{display:"flex", gap:8, marginTop:12}}>
        <button onClick={toggleMic} style={btnStyle}>{micOn ? "Mute Mic" : "Unmute Mic"}</button>
        <button onClick={toggleCam} style={btnStyle}>{camOn ? "Turn Camera Off" : "Turn Camera On"}</button>
        <button onClick={copyLink} style={{...btnStyle, background:"#0a7a35", borderColor:"#0a7a35"}}>{linkCopied ? "Copied!" : "Copy Invite Link"}</button>
        <a href="/lumalink" style={{...btnStyle, textDecoration:"none", textAlign:"center"}}>Leave</a>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"2fr 1fr", gap:12, marginTop:12}}>
        <div />
        <div style={{border:"1px solid #eee", borderRadius:12, padding:12}}>
          <div style={{fontWeight:600, marginBottom:6}}>Chat</div>
          <div style={{height:160, overflow:"auto", background:"#fafafa", border:"1px solid #eee", borderRadius:8, padding:8, marginBottom:8}}>
            {chat.map((m,i)=>(<div key={i} style={{fontSize:13, margin:"4px 0"}}>{m}</div>))}
          </div>
          <div style={{display:"flex", gap:6}}>
            <input value={chatMsg} onChange={(e)=>setChatMsg(e.target.value)} placeholder="Type a message…"
              style={{flex:1, padding:"8px 10px", borderRadius:8, border:"1px solid #ddd"}}/>
            <button onClick={sendMsg} style={btnStyle}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
