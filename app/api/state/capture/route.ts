export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{session:"active",signals:["scroll","tap","pause"],enabled:true},
    ts:Date.now()
  });
}
