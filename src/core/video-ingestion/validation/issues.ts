import type {
  MediaValidationIssue,
  MediaValidationSeverity,
} from "./types";

export function createMediaValidationIssue(
  code: string,
  severity: MediaValidationSeverity,
  message: string,
  field?: string,
): MediaValidationIssue {
  return {
    code,
    severity,
    message,
    field,
  };
}

export function hasFatalValidationIssue(issues: MediaValidationIssue[]) {
  return issues.some((issue) => issue.severity === "fatal");
}

export function hasBlockingValidationIssue(issues: MediaValidationIssue[]) {
  return issues.some((issue) => issue.severity === "fatal" || issue.severity === "error");
}
