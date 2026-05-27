export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{dailyBudget:100,spent:32,remaining:68},
    ts:Date.now()
  });
}
