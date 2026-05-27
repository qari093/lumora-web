import {
  describe,
  expect,
  it
} from "vitest";

import {
  existsSync,
  writeFileSync
} from "node:fs";

import {
  API_CONTRACT_RULES,
  API_ROUTE_FIXTURES,
  inspectApiContract,
  buildApiContractHardeningReport
} from "@/src/core/launch-readiness";

describe(
  "Launch Readiness Phase 04 — API & Contract Hardening",
  () => {
    it(
      "defines contract rules",
      () => {
        expect(
          API_CONTRACT_RULES.length
        ).toBeGreaterThanOrEqual(5);
      }
    );

    it(
      "defines API fixtures",
      () => {
        expect(
          API_ROUTE_FIXTURES.length
        ).toBeGreaterThanOrEqual(4);
      }
    );

    it(
      "passes stable wallet route",
      () => {
        const fixture =
          API_ROUTE_FIXTURES.find(
            (x) => x.route === "/api/wallet/credit"
          )!;

        const inspection =
          inspectApiContract(fixture);

        expect(
          inspection.status
        ).toBe("PASS");
      }
    );

    it(
      "fails unsafe legacy route",
      () => {
        const fixture =
          API_ROUTE_FIXTURES.find(
            (x) => x.route === "/api/legacy/raw-wallet"
          )!;

        const inspection =
          inspectApiContract(fixture);

        expect(
          inspection.status
        ).toBe("FAILED");

        expect(
          inspection.missing
        ).toContain("request_id");
      }
    );

    it(
      "builds contract hardening report",
      () => {
        const report =
          buildApiContractHardeningReport();

        expect(
          report.totalRoutes
        ).toBeGreaterThanOrEqual(4);

        expect(
          report.failedRoutes
        ).toBeGreaterThanOrEqual(1);
      }
    );

    it(
      "writes contract report",
      () => {
        const report =
          buildApiContractHardeningReport();

        writeFileSync(
          "docs/launch-readiness/phase04_api_contract_hardening_report.json",
          JSON.stringify(report, null, 2) + "\n"
        );

        expect(
          existsSync(
            "docs/launch-readiness/phase04_api_contract_hardening_report.json"
          )
        ).toBe(true);
      }
    );

    it(
      "creates API contract endpoint",
      () => {
        expect(
          existsSync(
            "app/api/launch-readiness/api-contracts/route.ts"
          )
        ).toBe(true);
      }
    );
  }
);
