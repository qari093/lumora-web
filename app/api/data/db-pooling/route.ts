export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      pooling:true,
      maxConnections:20,
      mode:"shared",
      enabled:true
    },
    ts:Date.now()
  });
}
