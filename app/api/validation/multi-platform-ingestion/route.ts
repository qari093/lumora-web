export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      sources:["tiktok","instagram","x","reddit","trends","rss","twitch"],
      validated:true,
      failures:0
    },
    ts:Date.now()
  });
}
