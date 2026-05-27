export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      fallbackFeed:true,
      trigger:"empty-or-unsafe-feed",
      sources:["trusted-cache","seed-pack","editorial-safe"],
      enabled:true
    },
    ts:Date.now()
  });
}
