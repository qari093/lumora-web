import type { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { getS3, requireBucket } from "@/src/lib/s3";

type Body = { contentType?: string; ext?: string; prefix?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { contentType, ext, prefix }: Body = req.body || {};
    const bucket = requireBucket();
    const key = [
      prefix || "uploads",
      new Date().toISOString().slice(0,10),
      crypto.randomBytes(8).toString("hex") + (ext ?  : "")
    ].join("/");

    const client = getS3();
    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType || "application/octet-stream",
      // ACL: "public-read", // uncomment only if your bucket policy allows and you want public objects
    });

    const url = await getSignedUrl(client, cmd, { expiresIn: 900 }); // 15 min
    res.status(200).json({ url, key, method: "PUT" });
  } catch (e:any) {
    console.error(e);
    res.status(500).json({ error: e.message || "internal_error" });
  }
}
