export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{storage:"session-cache",ttl:600,enabled:true},
    ts:Date.now()
  });
}
