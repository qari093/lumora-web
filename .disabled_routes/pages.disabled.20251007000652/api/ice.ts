import type { NextApiRequest, NextApiResponse } from "next";

async function getTwilioIce() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const ttl = Number(process.env.TWILIO_TURN_TTL || "3600");
  if (!sid || !token) return null;
  try {
    const resp = await fetch(, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from().toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ Ttl: String(ttl) }),
    });
    if (!resp.ok) throw new Error(await resp.text());
    const data = (await resp.json()) as any;
    const servers = (data.ice_servers || data.iceServers || []).map((s: any) => ({
      urls: s.urls ?? s.url,
      username: s.username,
      credential: s.credential,
    }));
    return servers.length ? servers : null;
  } catch {
    return null;
  }
}

function publicStun() {
  return [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
    { urls: "stun:stun1.l.google.com:19302" },
  ];
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const provider = (process.env.TURN_PROVIDER || "public").toLowerCase();
  if (provider === "static" && process.env.TURN_STATIC_ICE_JSON) {
    try {
      return res.status(200).json({ iceServers: JSON.parse(process.env.TURN_STATIC_ICE_JSON) });
    } catch {}
  }
  if (provider === "twilio") {
    const tw = await getTwilioIce();
    if (tw) return res.status(200).json({ iceServers: tw });
  }
  return res.status(200).json({ iceServers: publicStun() });
}
