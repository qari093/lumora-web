import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { genQueue } from "@/lib/queue";
import { nanoid } from "nanoid";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=="POST") return res.status(405).json({error:"method_not_allowed"});
  const { category="studio", topic="Quick", script={ scenes:[{ text:"Hello", duration:3 }] }, platform="TIKTOK", lang="EN" } = req.body||{};
  const project = await prisma.videoProject.create({ data:{ category, topic, script, platform, lang }});
  const jobId = nanoid();
  await prisma.renderJob.create({ data:{ id:jobId, projectId:project.id, jobType:"VIDEO", status:"QUEUED", input:script, platform, lang }});
  await genQueue.add("generate",{ projectId: project.id, platform, lang },{ jobId });
  return res.status(200).json({ ok:true, projectId: project.id, jobId });
}
