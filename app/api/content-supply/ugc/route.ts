export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{prompts:["First reaction?","Best moment?","Worth watching?"],enabled:true},
    ts:Date.now()
  });
}
