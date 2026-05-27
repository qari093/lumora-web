export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{strategy:"fallback-refresh",cycle:300,enabled:true},
    ts:Date.now()
  });
}
