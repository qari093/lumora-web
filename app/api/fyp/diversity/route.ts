export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      diversityControl:true,
      dimensions:["source","topic","format","region"],
      policy:"anti-clump",
      enabled:true
    },
    ts:Date.now()
  });
}
