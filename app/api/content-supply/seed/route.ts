export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{items:["seed_1","seed_2","seed_3"],enabled:true},
    ts:Date.now()
  });
}
