// app/music/page.tsx
export const dynamic = "force-dynamic";
export default function Page(){ 
  return (
    <main style={{padding:24,fontFamily:"system-ui,Segoe UI,Arial"}}>
      <h1 style={{fontSize:28,fontWeight:900,margin:"8px 0"}}>Music Player</h1>
      <p style={{opacity:.7,margin:"6px 0 14px"}}>Placeholder page for <code>/music</code>. Wire real UI later.</p>
      <p><a href="/overlay-demo" style={{textDecoration:"underline"}}>Back to Overlay Demo</a></p>
    </main>
  );
}
