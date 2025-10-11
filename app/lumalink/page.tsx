import Link from "next/link";

const pill: React.CSSProperties = {
  padding:"10px 14px", borderRadius:12, border:"1px solid rgba(255,255,255,.15)",
  background:"rgba(255,255,255,.08)", color:"#fff", textDecoration:"none", fontWeight:800, display:"inline-block", marginRight:8
};

export default function Page() {
  return (
    <div style={{padding:16}}>
      <h1 style={{marginBottom:8}}>🪄 LumaLink</h1>
      <p style={{opacity:.85, marginBottom:16}}>Unified chat + live rooms. Socket status is on the top-right.</p>
      <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
        <Link href="/lumalink/chat" style={pill}>Open Chat</Link>
        <Link href="/lumalink/room" style={pill}>Join Room</Link>
        <Link href="/creator" style={pill}>Back to Creator</Link>
      </div>
    </div>
  );
}
