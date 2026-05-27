export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      pacingModel:true,
      preferences:["fast-cut","balanced","slow-burn"],
      adaptation:"session-aware",
      enabled:true
    },
    ts:Date.now()
  });
}
