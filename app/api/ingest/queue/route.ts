export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      queue:"async-ingestion",
      status:"active",
      buffering:true,
      enabled:true
    },
    ts:Date.now()
  });
}
