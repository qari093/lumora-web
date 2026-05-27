export type DashboardRuntimeState = {
  creatorId: string;
  connected: true;
  state: "at-rest" | "awaiting-circle" | "being-witnessed" | "after-witness" | "echo-active";
  updatedAt: string;
};

export function connectDashboardToRuntimeState(input: {
  creatorId: string;
  state: DashboardRuntimeState["state"];
  updatedAt?: string;
}): DashboardRuntimeState {
  return {
    creatorId: input.creatorId,
    connected: true,
    state: input.state,
    updatedAt: input.updatedAt || new Date().toISOString(),
  };
}
