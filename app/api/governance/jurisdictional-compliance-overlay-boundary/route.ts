import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/requireAdminSession";
import { evaluateJurisdictionalComplianceOverlay, JURISDICTIONAL_COMPLIANCE_OVERLAY_BOUNDARY_VERSION, JURISDICTIONAL_COMPLIANCE_OVERLAY_CONTRACT, type JurisdictionalComplianceOverlayInput } from "@/core/governance/jurisdictionalComplianceOverlayBoundary";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  let body: JurisdictionalComplianceOverlayInput;
  try { body = await request.json() as JurisdictionalComplianceOverlayInput; }
  catch { return NextResponse.json({ ok:false, error:"invalid_json" }, { status:400, headers:{"Cache-Control":"no-store"} }); }
  const result = evaluateJurisdictionalComplianceOverlay(body);
  return NextResponse.json({ ok:result.allowed, boundary:"jurisdictional_compliance_overlay_and_constitutional_core_protection", version:JURISDICTIONAL_COMPLIANCE_OVERLAY_BOUNDARY_VERSION, result, contract:JURISDICTIONAL_COMPLIANCE_OVERLAY_CONTRACT, authority:{source:"authenticated_admin_session", callerSuppliedAuthenticationAccepted:false, governmentalAuthorityCreated:false, legalCitizenshipCreated:false, independentJurisdictionCreated:false} }, { status: result.allowed ? 200 : 422, headers:{"Cache-Control":"no-store"} });
}
