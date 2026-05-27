export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      partitioning:"time-source",
      windows:["hourly","daily"],
      enabled:true
    },
    ts:Date.now()
  });
}
