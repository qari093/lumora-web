import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { getRequestId } from "@/src/lib/reqid";
import { logInfo, logError } from "@/src/lib/log";

type ApiHandler = (req: Request) => Promise<Response> | Response;

async function auditLog(p: {
  requestId: string | null;
  name: string;
  method: string;
  url: string;
  status: number;
  error?: string | null;
}) {
  if (process.env.AUDIT_DB !== "1") return;
  try {
    await prisma.apiLog.create({
      data: {
        requestId: p.requestId ?? null,
        name: p.name,
        method: p.method,
        url: p.url,
        status: p.status,
        error: p.error ?? null,
      },
    });
  } catch (e) {
    console.error(JSON.stringify({ level:"error", msg:"auditLog.fail", ts:new Date().toISOString(), err:String(e) }));
  }
}

export function withLog(handler: ApiHandler, name = "api.handler") {
  return async function wrapped(req: Request): Promise<Response> {
    const rid = getRequestId();
    logInfo("api.request", { name, method: req.method, url: req.url, requestId: rid });
    try {
      const res = await handler(req);
      try { (res.headers as any)?.set?.("x-request-id", rid); } catch {}
      await auditLog({ requestId: rid, name, method: req.method, url: req.url, status: (res as any)?.status ?? 200 });
      return res;
    } catch (err: any) {
      const message = err?.message ?? "Unknown error";
      logError("api.error", { name, requestId: rid, message, stack: err?.stack });
      await auditLog({ requestId: rid, name, method: req.method, url: req.url, status: 500, error: message });
      return NextResponse.json({ ok:false, error:"INTERNAL_ERROR", requestId: rid }, { status: 500 });
    }
  };
}
