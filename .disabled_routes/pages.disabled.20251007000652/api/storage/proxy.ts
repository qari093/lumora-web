import type { NextApiRequest, NextApiResponse } from "next";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getS3, requireBucket } from "@/lib/s3";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    const key = req.query.key as string | undefined;
    if (!key) return res.status(400).json({ error: "Missing key" });

    const client = getS3();
    const out = await client.send(new GetObjectCommand({ Bucket: requireBucket(), Key: key }));
    // Forward content-type if present
    const ct = out.ContentType || "application/octet-stream";
    res.setHeader("Content-Type", ct);
    if (out.Body && "pipe" in out.Body) {
      // node stream
      (out.Body as any).pipe(res);
    } else {
      // fallback: buffer the whole thing (edge cases)
      const chunks: Uint8Array[] = [];
      for await (const c of out.Body as any) chunks.push(c);
      res.send(Buffer.concat(chunks));
    }
  } catch (e:any) {
    console.error(e);
    res.status(500).json({ error: e.message || "internal_error" });
  }
}
