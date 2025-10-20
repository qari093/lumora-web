export const dynamic = "force-dynamic";
async function loadCampaign(id: string){
  const r = await fetch(`/api/campaigns/${encodeURIComponent(id)}`, { cache:"no-store" });
  if (!r.ok) return null;
  return r.json().catch(()=>null);
}
export default async function CampaignDetail({ params }: { params: { id: string } }){
  const j = await loadCampaign(params.id);
  const c = j?.campaign || j;
  return (
    <div style={{padding:24}}>
      <h1 style={{marginTop:0}}>Campaign Detail</h1>
      {!c && <div style={{color:"crimson"}}>Not found or failed to load.</div>}
      {c && (
        <pre style={{background:"#f7f7f7", padding:16, borderRadius:8, overflow:"auto"}}>
{JSON.stringify(c, null, 2)}
        </pre>
      )}
    </div>
  );
}
