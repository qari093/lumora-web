import { prisma } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export default async function PublicPlaylist({ params }:{ params:{ id:string } }){
  const pl = await prisma.playlist.findUnique({ where:{ id: params.id }, include:{ items:true } });
  if(!pl || pl.visibility!=="PUBLIC"){
    return <div style={{padding:24}}>Playlist not found or not public.</div>;
  }
  return (
    <main style={{maxWidth:900,margin:"0 auto",padding:"16px"}}>
      <h1 style={{fontSize:28,fontWeight:800,marginBottom:8}}>{pl.name}</h1>
      <div style={{opacity:.75,marginBottom:16}}>Tracks: {pl.items.length}</div>
      <div style={{display:"grid",gap:10}}>
        {pl.items.sort((a,b)=>a.position-b.position).map(it=>(
          <div key={it.id} style={{background:"#18181b",border:"1px solid #27272a",borderRadius:10,padding:12}}>
            <div style={{fontWeight:700}}>{it.title}</div>
            <div style={{opacity:.75,fontSize:13}}>{it.artist||"Unknown"} {it.genre?("• "+it.genre):""}</div>
            <audio src={it.url} preload="none" controls style={{width:"100%",marginTop:8}}/>
          </div>
        ))}
      </div>
    </main>
  );
}
