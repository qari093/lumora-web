export type ConnectivityChannel =
  | "whatsapp"
  | "telegram"
  | "signal"
  | "sms"
  | "email"
  | "qr"
  | "nfc"
  | "airdrop"
  | "nearby_share"
  | "web_embed"
  | "api"
  | "import_export"
  | "federation";

export type ConnectivityCapability = {
  channel: ConnectivityChannel;
  external: boolean;
  supportsText: boolean;
  supportsUrl: boolean;
  supportsFiles: boolean;
  supportsSilentDelivery: boolean;
  requiresUserGesture: boolean;
};

export type ConnectivityPayload = {
  shareId: string;
  title: string;
  text: string;
  url: string;
  channel: ConnectivityChannel;
  metadata: Record<string, unknown>;
};

export type ConnectivityRoute = {
  id: string;
  channel: ConnectivityChannel;
  destination: string;
  priority: number;
  healthy: boolean;
};

export type ConnectivityResult = {
  ok: boolean;
  channel: ConnectivityChannel;
  action: string;
  payload: ConnectivityPayload;
  warnings: string[];
};
