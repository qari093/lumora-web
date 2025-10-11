import type { NextApiRequest, NextApiResponse } from 'next';

function clear(name: string) {
  return `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', [clear('role'), clear('name'), clear('uid')]);
  res.status(200).json({ ok: true, signout: true, via: 'pages-api' });
}
