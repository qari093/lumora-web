export function createComplianceAudit(input: {
  transparencyOk: boolean;
  disclosureOk: boolean;
  dataProtectionOk: boolean;
}) {
  const issues: string[] = [];

  if (!input.transparencyOk) issues.push("transparency_failed");
  if (!input.disclosureOk) issues.push("disclosure_failed");
  if (!input.dataProtectionOk) issues.push("data_protection_failed");

  return {
    ok: issues.length === 0,
    issues,
  };
}
