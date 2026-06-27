import { getEnabledRefreshSources } from "./sourceRefreshRegistry";

export interface RefreshJob {
  sourceId: string;
  scheduled: boolean;
}

export function buildRefreshJobs(): RefreshJob[] {
  return getEnabledRefreshSources().map(source => ({
    sourceId: source.id,
    scheduled: true
  }));
}
