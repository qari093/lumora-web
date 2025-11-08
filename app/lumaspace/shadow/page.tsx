"use client";

export default function Page(){
  return (
    <main style={{padding:20,maxWidth:980,margin:"0 auto"}}>
    <div data-zen-preview-link style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}>
      <Link href="/me/space" style={{border:"1px solid #0b8",background:"#0b8",color:"#fff",borderRadius:8,padding:"6px 10px",textDecoration:"none",fontWeight:800}}>
        ⚡ Zen Preview
      </Link>
    </div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginBottom:10}}>
    <a href={"/lumaspace/shadow/analytics"} style={{border:"1px solid #555",borderRadius:8,padding:"6px 10px",textDecoration:"none",fontWeight:700}}>📊 Analytics</a>
    <a href={"/api/lumaspace/shadow/export?email=demo@lumora.local"} style={{border:"1px solid #0b8",background:"#0b8",color:"#fff",borderRadius:8,padding:"6px 10px",textDecoration:"none",fontWeight:700}}>⬇️ Download CSV</a>
  </div>
      <h1 style={{margin:"8px 0 12px"}}>Shadow Journal</h1>
      <p style={{opacity:.8}}>Page re-created. Entries UI can be restored later. CSV download works above.</p>
    </main>
  );
}
