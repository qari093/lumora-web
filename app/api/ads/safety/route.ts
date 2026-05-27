export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{safe:true,violations:0},
    ts:Date.now()
  });
}
