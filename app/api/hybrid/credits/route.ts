import { NextResponse } from 'next/server';
import { getBalance, addCredits } from '@/app/modules/hybrid/state';

function pickUser(u: URL){ return u.searchParams.get('user') || 'DEV'; }

export async function GET(req: Request){
  try{
    const url=new URL(req.url);
    const user=pickUser(url);
    const action=url.searchParams.get('action')||'get';
    if(action==='claim'){
      const amtRaw=url.searchParams.get('amount');
      const amt=Number.isFinite(Number(amtRaw)) ? Number(amtRaw) : 1;
      const credits=addCredits(user, amt);
      return NextResponse.json({ ok:true, user, credits });
    }
    const credits=getBalance(user);
    return NextResponse.json({ ok:true, user, credits });
  }catch(e:any){
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}

export async function POST(req: Request){
  try{
    const url=new URL(req.url);
    const user=pickUser(url);
    const body=await req.json().catch(()=>({})) as any;
    const action=(body?.action||'get') as string;
    if(action==='claim'){
      const amt=Number.isFinite(Number(body?.amount)) ? Number(body.amount) : 1;
      const credits=addCredits(user, amt);
      return NextResponse.json({ ok:true, user, credits });
    }
    const credits=getBalance(user);
    return NextResponse.json({ ok:true, user, credits });
  }catch(e:any){
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
