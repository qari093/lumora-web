export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{context:"entertainment-trailer",matchScore:0.81},
    ts:Date.now()
  });
}
