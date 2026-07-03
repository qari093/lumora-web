import fs from "node:fs";
import type {
  VideoIngestionCertificationCheck,
  VideoIngestionFoundationPack,
} from "./types";

const requiredRuntimePaths: Record<VideoIngestionFoundationPack, string> = {
  runtime: "src/core/video-ingestion/runtime/index.ts",
  providers: "src/core/video-ingestion/providers/index.ts",
  validation: "src/core/video-ingestion/validation/index.ts",
  rights: "src/core/video-ingestion/rights/index.ts",
  processing: "src/core/video-ingestion/processing/index.ts",
  emotion: "src/core/video-ingestion/emotion/index.ts",
  health: "src/core/video-ingestion/health/index.ts",
  store: "src/core/video-ingestion/store/index.ts",
  bridge: "src/core/video-ingestion/bridge/index.ts",
};

export function createCertificationCheck(
  id: string,
  label: string,
  passed: boolean,
  detail: string,
): VideoIngestionCertificationCheck {
  return {
    id,
    label,
    status: passed ? "pass" : "fail",
    detail,
  };
}

export function createRuntimeModuleChecks(): VideoIngestionCertificationCheck[] {
  return Object.entries(requiredRuntimePaths).map(([pack, path]) =>
    createCertificationCheck(
      `runtime_${pack}`,
      `${pack} runtime module exists`,
      fs.existsSync(path),
      path,
    ),
  );
}
