export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      trailerOverride:true,
      priority:"hard-override",
      enabled:true
    },
    ts:Date.now()
  });
}
