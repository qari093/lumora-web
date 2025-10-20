import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(200).json({ ok: true, ts: Date.now() });
}
