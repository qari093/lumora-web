import type { NextApiRequest, NextApiResponse } from "next";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import prisma from "@/src/lib/db";
import { scanBuffer } from "@/src/lib/av-scanner";

const s3 = new S3Client({
  region: process.env.S3_REGION || "auto",
  credentials: process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  } : undefined,
});

async function getS3Buffer(bucket:string, key:string){
  const out = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const chunks: Buffer[] = [];
  // @ts-ignore
  for await (const c of out.Body) chunks.push(Buffer.from(c));
  return Buffer.concat(chunks);
}

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if (req.method !== "POST") return res.status(405).json({ error:"method_not_allowed" });
  const { key, mime, size } = req.body || {};
  const bucket = process.env.S3_BUCKET;
  if (!bucket || !key) return res.status(400).json({ error:"missing_bucket_or_key" });

  try {
    // حد: 200MB سے اوپر اسکپ (MVP)
    if (size && Number(size) > 200*1024*1024) {
      await prisma.moderationItem.create({ data:{
        kind:"FILE", status:"REJECTED", title:key, fileKey:key, reason:"too_large_mvp",
      }});
      return res.status(200).json({ ok:true, scan:{ status:"INFECTED", reason:"too_large_mvp" } });
    }

    const buf = await getS3Buffer(bucket, key);
    const scan = await scanBuffer(buf, key, mime);

    const status = scan.status === "CLEAN" ? "PENDING" : "REJECTED";
    await prisma.moderationItem.create({
      data:{
        kind:"FILE",
        status,
        title:key,
        fileKey:key,
        sha256: scan.sha256,
        scanStatus: scan.status as any,
        scanAt: new Date(),
        reason: scan.reason || null,
        policyTags: scan.status === "INFECTED" ? ["malware"] as any : undefined,
      }
    });

    return res.status(200).json({ ok:true, scan });
  } catch (e:any) {
    console.error(e);
    return res.status(500).json({ error:"scan_failed", detail: e.message });
  }
}
