export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      accuracyScore:0.84,
      threshold:0.75,
      passed:true
    },
    ts:Date.now()
  });
}
