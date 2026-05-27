import { describe, expect, it } from "vitest";

import {
  validateRuntimeMatrixEntry
} from "@/src/core/fyp/final-matrix/contracts/runtimeMatrixContract";

import {
  evaluateRuntimeMatrix
} from "@/src/core/fyp/final-matrix/runtime/runtimeMatrixEvaluator";

import {
  runRuntimeMatrixValidation
} from "@/src/core/fyp/final-matrix/runtime/runtimeMatrixRuntime";

const entries = [
  {
    pack: 68,
    name: "observability",
    passed: true,
    marker: ".lumora_fyp_pack68_lock"
  },
  {
    pack: 69,
    name: "recovery",
    passed: true,
    marker: ".lumora_fyp_pack69_lock"
  },
  {
    pack: 70,
    name: "production-seal",
    passed: true,
    marker: ".lumora_fyp_pack70_lock"
  }
];

describe("Lumora FYP Final Runtime Matrix Validation", () => {
  it("validates runtime matrix entry", () => {
    expect(validateRuntimeMatrixEntry(entries[0])).toBe(true);
  });

  it("evaluates passing runtime matrix", () => {
    const result = evaluateRuntimeMatrix(entries);

    expect(result.ok).toBe(true);
    expect(result.failed).toBe(0);
  });

  it("detects failed runtime matrix", () => {
    const result = evaluateRuntimeMatrix([
      ...entries,
      {
        pack: 71,
        name: "failed-check",
        passed: false,
        marker: ".failed"
      }
    ]);

    expect(result.ok).toBe(false);
    expect(result.failed).toBe(1);
  });

  it("rejects invalid matrix entry", () => {
    expect(() =>
      evaluateRuntimeMatrix([
        {
          ...entries[0],
          marker: ""
        }
      ])
    ).toThrow("invalid_runtime_matrix_entry");
  });

  it("runs final runtime matrix validation", () => {
    const result = runRuntimeMatrixValidation(entries);

    expect(result.ready).toBe(true);
    expect(result.passed).toBe(3);
  });
});
