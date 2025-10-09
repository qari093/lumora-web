import type { NextApiRequest, NextApiResponse } from "next";
import * as Sentry from "@sentry/nextjs";
import { error, info } from "@/src/lib/log";

export default async function handler(_req:NextApiRequest, res:NextApiResponse){
  try {
    info("manual_error_trigger",{ route:"/api/error-test" });
    throw new Error("Manual test error from /api/error-test");
  } catch (e:any) {
    error("captured_error",{ message:e.message, stack:e.stack });
    Sentry.captureException(e);
    return res.status(500).json({ ok:false, error:"sent_to_sentry" });
  }
}
