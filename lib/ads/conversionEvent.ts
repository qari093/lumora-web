export type ConversionEvent = {
  id: string;
  adId: string;
  portal: string;
  action: string;
  value: number;
  createdAt: number;
};

export function createConversionEvent(input: {
  adId: string;
  portal: string;
  action: string;
  value?: number;
}): ConversionEvent {
  return {
    id: `conv_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    adId: String(input.adId || ""),
    portal: String(input.portal || ""),
    action: String(input.action || ""),
    value: Math.max(0, Math.floor(input.value ?? 0)),
    createdAt: Date.now(),
  };
}
