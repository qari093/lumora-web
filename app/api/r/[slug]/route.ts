import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    const link = await prisma.shortLink.findUnique({ where: { slug } });
    if (!link) return NextResponse.json({ ok:false, error:"NOT_FOUND" }, { status:404 });

    const url = new URL(req.url);
    const ch  = url.searchParams.get("ch") || "web";
    const ip  = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "";
    const ua  = req.headers.get("user-agent") || "";

    await prisma.$transaction([
      prisma.channelHit.create({ data: { shortLinkId: link.id, channel: ch, ip: ip?.slice(0,64) || null, userAgent: ua?.slice(0,256) || null } }),
      prisma.shortLink.update({ where: { id: link.id }, data: { clicks: { increment: 1 } } })
    ]);

    const target = new URL(link.targetUrl, url.origin);
    if (!target.searchParams.get("ch")) target.searchParams.set("ch", ch);
    target.searchParams.set("slug", slug);

    const res = NextResponse.redirect(target.toString(), 302);
    res.headers.append("set-cookie", `lum_ch=${encodeURIComponent(ch)}; Path=/; Max-Age=86400; SameSite=Lax`);
    res.headers.append("set-cookie", `lum_slug=${encodeURIComponent(slug)}; Path=/; Max-Age=86400; SameSite=Lax`);
    return res;
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
