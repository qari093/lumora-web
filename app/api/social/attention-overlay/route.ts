export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      sharedAttention:true,
      layers:["heatmap","pulse","density"],
      enabled:true
    },
    ts:Date.now()
  });
}
