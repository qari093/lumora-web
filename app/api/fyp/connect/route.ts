export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      pipeline:["ingestion","intelligence","feed"],
      connection:"active",
      enabled:true
    },
    ts:Date.now()
  });
}
