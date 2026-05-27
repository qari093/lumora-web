export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      source:"twitch",
      type:"category-spikes",
      status:"connected"
    },
    ts:Date.now()
  });
}
