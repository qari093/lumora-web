export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <main style={{padding:"4rem 2rem",textAlign:"center",color:"#fff",background:"#0a0a0a",minHeight:"100vh"}}>
      <h1 style={{fontSize:"2rem",marginBottom:"1rem"}}>🔒 You’re Offline</h1>
      <p style={{opacity:0.85,marginBottom:"1.5rem"}}>
        Don’t worry — Lumora keeps your session safe.
      </p>
      <ul style={{listStyle:"none",padding:0,margin:0,opacity:0.8,lineHeight:1.6}}>
        <li>• Cached videos and ads play from local storage.</li>
        <li>• Actions queue safely and auto-submit on reconnect.</li>
        <li>• View limited creator & shop info offline.</li>
      </ul>
      <p style={{marginTop:"2rem",fontSize:"0.9rem",opacity:0.6}}>Reconnect to sync progress 🌐</p>
    </main>
  );
}
