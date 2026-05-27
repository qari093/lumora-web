export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{intent:"soft-interest",confidence:0.72},
    ts:Date.now()
  });
}
