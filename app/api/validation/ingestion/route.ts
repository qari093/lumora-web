export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      ingestionPipelines:true,
      sources:["tiktok","instagram","x","reddit","trends","rss","twitch"],
      live:true,
      enabled:true
    },
    ts:Date.now()
  });
}
