import type { ApiContractRule } from "./types";

export const API_CONTRACT_RULES: ApiContractRule[] = [
  {
    id: "request_id",
    name: "Request ID",
    required: true,
    description: "All responses must contain a stable request identifier."
  },
  {
    id: "stable_envelope",
    name: "Stable Envelope",
    required: true,
    description: "All responses must use a stable JSON envelope."
  },
  {
    id: "safe_errors",
    name: "Safe Errors",
    required: true,
    description: "Unsafe internal errors must never leak."
  },
  {
    id: "versioning",
    name: "Versioning",
    required: true,
    description: "Contracts must expose version metadata."
  },
  {
    id: "typed_meta",
    name: "Typed Meta",
    required: false,
    description: "Routes should expose structured metadata."
  }
];
