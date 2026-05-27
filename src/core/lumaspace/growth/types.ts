export interface PortalCard {
  id: string;
  title: string;
}

export interface SparkInvite {
  id: string;
  target: string;
}

export interface GrowthRuntime {
  active: boolean;
  portalId: string;
}
