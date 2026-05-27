export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{alive:true,intervalSec:30,enabled:true},
    ts:Date.now()
  });
}
