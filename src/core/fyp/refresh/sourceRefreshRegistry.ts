export interface RefreshSource {
  id: string;
  enabled: boolean;
  refreshHours: number;
}

export const REFRESH_SOURCES: RefreshSource[] = [
  { id: "PEXELS", enabled: true, refreshHours: 24 },
  { id: "PIXABAY", enabled: true, refreshHours: 24 },
  { id: "MIXKIT", enabled: true, refreshHours: 24 },
  { id: "NASA", enabled: true, refreshHours: 48 }
];

export function getEnabledRefreshSources(): RefreshSource[] {
  return REFRESH_SOURCES.filter(source => source.enabled);
}
