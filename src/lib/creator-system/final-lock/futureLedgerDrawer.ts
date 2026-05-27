import { getCreatorLedgerStatus } from "./deferredLedger";

export type FutureLedgerDrawer = {
  visible: false;
  connected: true;
  status: ReturnType<typeof getCreatorLedgerStatus>;
};

export function buildFutureLedgerDrawer(): FutureLedgerDrawer {
  return {
    visible: false,
    connected: true,
    status: getCreatorLedgerStatus(),
  };
}
