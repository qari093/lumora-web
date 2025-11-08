import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { assertAdmin } from '@/lib/adminAuth'
export const runtime = 'nodejs'
export async function POST(req: Request) {
  try {
    assertAdmin(req)
    const { submissionId, action } = await req.json()
    if (!submissionId || !['APPROVE','REJECT'].includes(action)) return NextResponse.json({ ok:false, error:'submissionId and valid action required' },{ status:400 })
    const sub = await prisma.kycSubmission.findUnique({ where:{ id:submissionId } })
    if (!sub) return NextResponse.json({ ok:false, error:'submission not found' },{ status:404 })
    if (sub.status!=='PENDING') return NextResponse.json({ ok:false, error:`already ${sub.status}` },{ status:409 })
    if (action==='APPROVE') {
      await prisma.$transaction(async(tx)=>{
        await tx.kycSubmission.update({ where:{ id:sub.id }, data:{ status:'APPROVED' } })
        await tx.userAccount.upsert({
          where:{ ownerId:sub.ownerId },
          update:{ status:'ACTIVE', tier:sub.requestedTier??'TIER1' },
          create:{ ownerId:sub.ownerId, status:'ACTIVE', tier:sub.requestedTier??'TIER1' }
        })
      })
    } else {
      await prisma.kycSubmission.update({ where:{ id:sub.id }, data:{ status:'REJECTED' } })
    }
    return NextResponse.json({ ok:true, action, ownerId:sub.ownerId })
  } catch (err:any) {
    const status = Number(err?.status)||500
    return NextResponse.json({ ok:false, error:String(err?.message||err) },{ status })
  }
}
