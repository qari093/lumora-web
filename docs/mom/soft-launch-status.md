# Soft Launch — Status Overview

This document is auto-generated.

## Core Endpoints
- GET /api/orchestrator/summary
- GET /api/orchestrator/engines
- GET /api/orchestrator/engines/health
- GET /api/orchestrator/mode
- GET /api/soft-launch/admin-summary
- GET /api/soft-launch/metrics/summary
- GET /api/soft-launch/status
- GET /dash/orchestrator
- GET /dash/soft-launch

## Toolbelt Commands
\`\`\`bash
bash scripts/mom/soft-launch-toolbelt.sh status
bash scripts/mom/soft-launch-toolbelt.sh panic
\`\`\`


## Runtime Path

- Canonical mapper: `services/soft-launch/runtime-path.ts`
- Primary helper: `getSoftLaunchRuntimePath()`

## Soft-launch server guard helpers

The server guard layer keeps backend behaviour aligned with the canonical
soft-launch runtime path used by dashboards, UI guards, and M.O.M toolbelt.

**Module**

- `services/soft-launch/server-guard.ts`

**Exports**

- `checkSoftLaunchCapability(capability)`
  - Reads the hardened runtime path and returns an object describing:
    - current mode/profile
    - whether the requested capability is allowed
- `assertSoftLaunchCapability(capability)`
  - Throws when the capability is blocked by soft-launch rules.
  - Intended for internal-only jobs or strictly-controlled server utilities.
- `softLaunchGuardOrJson(capability, okFactory)`
  - Convenience wrapper for API routes:
    - Returns a `503` JSON payload when blocked
    - Delegates to `okFactory()` when allowed.

**Recommended API usage**

Example: payments/checkout route

```ts
import { NextResponse } from "next/server";
import { softLaunchGuardOrJson } from "@/services/soft-launch/server-guard";

export async function POST(req: Request) {
  return softLaunchGuardOrJson("payments", async () => {
    // existing checkout logic here
    const result = await runCheckout(req);
    return NextResponse.json(result, { status: 200 });
  });
}
```

Example: ads/campaign create route

```ts
import { NextResponse } from "next/server";
import { softLaunchGuardOrJson } from "@/services/soft-launch/server-guard";

export async function POST(req: Request) {
  return softLaunchGuardOrJson("ads", async () => {
    const payload = await req.json();
    const campaign = await createCampaign(payload);
    return NextResponse.json({ ok: true, campaign }, { status: 200 });
  });
}
```

These patterns ensure that server routes respect the same soft-launch capability
gates as the client-side guards and orchestrator dashboards.
