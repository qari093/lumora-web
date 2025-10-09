export async function POST(req: Request){
  const body = await req.json().catch(()=>({}));
  return new Response(JSON.stringify({ ok:true, received: body||null }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
export async function OPTIONS(){
  return new Response(null, { status: 204 });
}
