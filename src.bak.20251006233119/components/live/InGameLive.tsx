"use client";
import "@livekit/components-styles";
import { useEffect, useMemo, useState } from "react";
import { LiveKitRoom, GridLayout, ParticipantTile, ControlBar, Chat, RoomAudioRenderer } from "@livekit/components-react";

type Props = {
  room: string;     // e.g. "zen-fortress"
  name: string;     // player display name
  role?: "host" | "viewer";
  open: boolean;
  onClose: ()=>void;
};

export default function InGameLive({ room, name, role="host", open, onClose }: Props){
  const [cred,setCred] = useState<{url:string; token:string}|null>(null);
  const [err,setErr] = useState<string|null>(null);

  useEffect(()=>{
    if(!open) return;
    (async ()=>{
      try{
        const q = new URLSearchParams({ room, name, role });
        const r = await fetch(`/api/live/token?${q}`);
        const j = await r.json();
        if(!r.ok) throw new Error(j?.error || "token fetch failed");
        setCred({ url: j.url, token: j.token });
      }catch(e:any){ setErr(e.message || "token error"); }
    })();
  },[open,room,name,role]);

  if(!open) return null;

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,.6)", display:"grid", placeItems:"center", zIndex:70
    }}>
      <div style={{ width:"min(1100px,96vw)", height:"min(680px,92vh)", border:"1px solid #1f2937", borderRadius:12, overflow:"hidden", background:"#0b1220", color:"#e5e7eb", display:"grid", gridTemplateColumns:"1fr 300px" }}>
        <div style={{display:"grid",gridTemplateRows:"auto 1fr auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",borderBottom:"1px solid #1f2937"}}>
            <div style={{fontWeight:700}}>Live: {room}</div>
            <button onClick={onClose} style={{padding:"6px 10px",border:"1px solid #1f2937",borderRadius:8,background:"#0f172a",color:"#e5e7eb"}}>Close</button>
          </div>
          <div style={{display:"grid",gridTemplateRows:"1fr auto"}}>
            <LiveKitRoom
              serverUrl={cred?.url}
              token={cred?.token}
              connect
              video={role==="host"}
              audio={role==="host"}
              options={{ adaptiveStream:true }}
              style={{height:"100%"}}
            >
              <RoomAudioRenderer />
              <GridLayout style={{padding:10}}>
                <ParticipantTile />
              </GridLayout>
              <div style={{borderTop:"1px solid #1f2937",background:"#0f172a"}}>
                <ControlBar controls={{camera:true,microphone:true,screenShare:true,chat:true,leave:true}} />
              </div>
            </LiveKitRoom>
          </div>
        </div>
        <div style={{borderLeft:"1px solid #1f2937",display:"grid",gridTemplateRows:"auto 1fr"}}>
          <div style={{padding:8,fontWeight:700}}>Chat</div>
          <div style={{padding:8,overflow:"auto"}}>
            {/* Chat component renders when inside LiveKitRoom context */}
            <Chat />
          </div>
        </div>
      </div>
      {err && <div style={{position:"fixed",bottom:12,left:12,background:"#7f1d1d",color:"#fee2e2",padding:"8px 10px",borderRadius:8}}>Live error: {err}</div>}
    </div>
  );
}
