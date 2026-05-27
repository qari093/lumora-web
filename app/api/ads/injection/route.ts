export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{slot:"feed-inline",position:3},
    ts:Date.now()
  });
}
