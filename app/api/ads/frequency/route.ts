export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{capPerSession:3,remaining:2},
    ts:Date.now()
  });
}
