export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      pipeline:"ingest-to-storage",
      flow:["connector","normalize","queue","store"],
      enabled:true
    },
    ts:Date.now()
  });
}
