import React, { useState } from "react";
import type { NextPage } from "next";
import { shortId, safeStr } from "../../lib/lumalink/util";

const Box: React.FC<React.PropsWithChildren<{ title?: string }>> = ({ title, children }) => (
  <div style={{border:"1px solid #eaeaea",borderRadius:12,padding:16,marginBottom:16,background:"#fff"}}>
    {title ? <h3 style={{margin:"0 0 10px 0"}}>{title}</h3> : null}
    {children}
  </div>
);

const Page: NextPage = () => {
  const [room, setRoom] = useState("");
  function createRoom() {
    const id = shortId();
    window.location.href = `/lumalink/room/${encodeURIComponent(id)}?role=host`;
  }
  function joinRoom() {
    const r = safeStr(room);
    if (!r) { alert("Enter a room ID"); return; }
    window.location.href = `/lumalink/room/${encodeURIComponent(r)}?role=guest`;
  }
  return (
    <div style={{maxWidth:860, margin:"24px auto", padding:"0 16px",
      fontFamily:"-apple-system, Inter, Segoe UI, Roboto, Helvetica, Arial"}}>
      <h1 style={{margin:"0 0 8px 0"}}>LumaLink — Quick Join</h1>
      <p style={{marginTop:0, color:"#666"}}>Create or join a P2P call. Share the invite link with your guest.</p>

      <div style={{display:"grid", gap:16, gridTemplateColumns:"1fr 1fr"}}>
        <Box title="Start a New Room">
          <button onClick={createRoom}
            style={{padding:"12px 16px", borderRadius:10, border:"1px solid #111", background:"#111", color:"#fff", cursor:"pointer"}}>
            Create & Host
          </button>
        </Box>

        <Box title="Join Existing Room">
          <label style={{display:"block", marginBottom:10}}>
            <div style={{fontSize:12, opacity:0.7, marginBottom:6}}>Room ID</div>
            <input
              value={room}
              onChange={(e)=>setRoom(e.target.value)}
              placeholder="e.g. a1b2c3d"
              style={{width:"100%", padding:10, borderRadius:10, border:"1px solid #ddd"}}
            />
          </label>
          <button onClick={joinRoom}
            style={{padding:"12px 16px", borderRadius:10, border:"1px solid #111", background:"#111", color:"#fff", cursor:"pointer"}}>
            Join as Guest
          </button>
        </Box>
      </div>
    </div>
  );
};
export default Page;
