import { abVariant } from "@/lib/feed/ab/engine";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,variant:abVariant()}),{headers:{"content-type":"application/json"}});
}
