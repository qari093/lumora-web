import { createTransparencyLogEntry } from "./transparency";
import { validateAdDisclosure } from "./disclosure";
import { validateDataProtection } from "./dataProtection";
import { createComplianceAudit } from "./audit";

export function validateMonetizationCompliance() {
  const log = createTransparencyLogEntry({
    id: "log1",
    eventType: "ad_shown",
    actorId: "u1",
    reason: "eligible_green_state",
    createdAt: "2026-05-06T00:00:00.000Z",
  });

  const disclosure = validateAdDisclosure({
    label: "Sponsored",
    visible: true,
    sponsorName: "Lumora Partner",
  });

  const protection = validateDataProtection({
    usesDemographics: false,
    usesRawSensitiveData: false,
    usesSignalOnlyTargeting: true,
    userCanOptOut: true,
  });

  const audit = createComplianceAudit({
    transparencyOk: Boolean(log.id),
    disclosureOk: disclosure.ok,
    dataProtectionOk: protection.ok,
  });

  return {
    ok: audit.ok,
    log,
    disclosure,
    protection,
    audit,
  };
}
