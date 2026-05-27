export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      prefetching:true,
      window:3,
      strategy:"next-batch-warmup",
      enabled:true
    },
    ts:Date.now()
  });
}
