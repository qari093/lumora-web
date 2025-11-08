import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { assertAdmin } from '@/lib/adminAuth'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    assertAdmin(req)

    // Pull all, then filter pending in JS to avoid enum casing mismatches
    const rows = await prisma.kycSubmission.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true, ownerId: true, status: true, requestedTier: true, createdAt: true }
    })

    const PENDING = new Set(['PENDING','Pending','pending'])
    const items = rows.filter(r => PENDING.has(String(r.status)))

    return NextResponse.json({ ok: true, count: items.length, items })
  } catch (err: any) {
    const status = Number(err?.status) || 500
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status })
  }
}
