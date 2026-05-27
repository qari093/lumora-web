export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      fomo:true,
      drivers:["countdown","exclusivity","replay-window"],
      enabled:true
    },
    ts:Date.now()
  });
}
