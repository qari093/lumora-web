export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      failover:true,
      primary:"db-a",
      secondary:"db-b",
      enabled:true
    },
    ts:Date.now()
  });
}
