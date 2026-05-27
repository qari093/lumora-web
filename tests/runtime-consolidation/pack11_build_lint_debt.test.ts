import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  buildBuildDebtReport,
  buildCurrentBuildDebtBaseline,
  classifyBuildWarning,
  createBuildDebtFinding,
  parseNextBuildWarnings,
  severityForCategory
} from "@/src/core/runtime-consolidation";

describe("Runtime Consolidation Pack 11 — Build + Lint Debt Control", () => {
  it("classifies build warnings", () => {
    expect(classifyBuildWarning("React Hook useEffect has a missing dependency")).toBe("react_hooks");
    expect(classifyBuildWarning("'x' is assigned a value but never used")).toBe("unused_symbol");
    expect(classifyBuildWarning("Unused eslint-disable directive")).toBe("unused_eslint_disable");
    expect(classifyBuildWarning("Error occurred prerendering page")).toBe("prerender");
    expect(classifyBuildWarning("Attempted import error")).toBe("import_export");
  });

  it("assigns severity by category", () => {
    expect(severityForCategory("prerender")).toBe("critical");
    expect(severityForCategory("import_export")).toBe("critical");
    expect(severityForCategory("react_hooks")).toBe("high");
    expect(severityForCategory("unused_symbol")).toBe("low");
  });

  it("creates findings", () => {
    const finding = createBuildDebtFinding({
      file: "./src/components/native-fyp/FypSwiper.tsx",
      message: "Warning: React Hook useEffect has a missing dependency"
    });

    expect(finding.category).toBe("react_hooks");
    expect(finding.severity).toBe("high");
  });

  it("parses Next build warnings", () => {
    const findings = parseNextBuildWarnings(`
./src/components/native-fyp/FypSwiper.tsx
57:29 Warning: React Hook "usePreload" cannot be called inside a callback.
./app/api/gmar/state/init/route.ts
Attempted import error: 'x' is not exported
Error occurred prerendering page "/gmar".
`);

    expect(findings.length).toBeGreaterThanOrEqual(3);
    expect(findings.some((finding) => finding.category === "react_hooks")).toBe(true);
    expect(findings.some((finding) => finding.category === "import_export")).toBe(true);
    expect(findings.some((finding) => finding.category === "prerender")).toBe(true);
  });

  it("builds failed report when critical findings exist", () => {
    const report = buildBuildDebtReport([
      createBuildDebtFinding({
        file: "./app/gmar/page.tsx",
        message: "Error occurred prerendering page"
      })
    ]);

    expect(report.status).toBe("FAILED");
    expect(report.bySeverity.critical).toBe(1);
  });

  it("builds clean baseline report", () => {
    const report = buildCurrentBuildDebtBaseline();

    expect(report.status).toBe("PASS");
    expect(report.totalFindings).toBe(0);
  });

  it("writes build lint debt report", () => {
    const report = buildCurrentBuildDebtBaseline();
    writeFileSync("docs/runtime-consolidation/build_lint_debt_report.json", JSON.stringify(report, null, 2) + "\n");

    expect(existsSync("docs/runtime-consolidation/build_lint_debt_report.json")).toBe(true);
  });

  it("creates build debt API endpoint", () => {
    expect(existsSync("app/api/runtime-consolidation/build-debt/route.ts")).toBe(true);
  });
});
