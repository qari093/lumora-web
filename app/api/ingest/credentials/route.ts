export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      providers:["tiktok","instagram","x","reddit","trends","rss","twitch"],
      vault:"initialized",
      enabled:true
    },
    ts:Date.now()
  });
}
