import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  try{
    if(req.method!=="GET") return res.status(405).json({ok:false, error:"Method not allowed"});
    const campaign = await prisma.campaign.findFirst({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
      include: { ads: true },
    });
    if(!campaign){
      return res.status(200).json({ ok:true, ad:null });
    }
    const creative = campaign.ads[0] ?? {
      id: "ad_"+campaign.id,
      headline: campaign.name,
      description: "Discover this local offer powered by Lumora.",
      imageUrl: "/luma/demo-ad.png",
      ctaText: "Learn More"
    } as any;

    const ad = {
      adId: creative.id,
      campaignId: campaign.id,
      headline: creative.headline,
      description: creative.description,
      imageUrl: creative.imageUrl || "/luma/demo-ad.png",
      ctaText: creative.ctaText || "Learn More",
      lumaCardUrl: `/l/${campaign.id}` // future: vendor LumaCard
    };
    return res.status(200).json({ ok:true, ad });
  }catch(e:any){
    console.error("[ad-server/next]", e);
    return res.status(500).json({ ok:false, error:"Server error" });
  }
}
