export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{windowSec:120,autoRecover:true,enabled:true},
    ts:Date.now()
  });
}
