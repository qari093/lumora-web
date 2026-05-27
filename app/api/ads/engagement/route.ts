export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{clicks:12,views:120,ctr:0.1},
    ts:Date.now()
  });
}
