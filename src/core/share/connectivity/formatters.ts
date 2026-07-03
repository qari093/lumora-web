import type { ConnectivityPayload } from "./types";

function enc(value: string): string {
  return encodeURIComponent(value);
}

export function formatExternalText(payload: ConnectivityPayload): string {
  return `${payload.title}\n${payload.text}\n${payload.url}`.trim();
}

export function formatWhatsAppShare(payload: ConnectivityPayload): string {
  return `https://wa.me/?text=${enc(`${payload.text} ${payload.url}`.trim())}`;
}

export function formatTelegramShare(payload: ConnectivityPayload): string {
  return `https://t.me/share/url?url=${enc(payload.url)}&text=${enc(payload.text)}`;
}

export function formatSignalShare(payload: ConnectivityPayload): string {
  return `sgnl://send?text=${enc(`${payload.text} ${payload.url}`.trim())}`;
}

export function formatSmsShare(payload: ConnectivityPayload): string {
  return `sms:?&body=${enc(`${payload.text} ${payload.url}`.trim())}`;
}

export function formatEmailShare(payload: ConnectivityPayload): string {
  return `mailto:?subject=${enc(payload.title)}&body=${enc(formatExternalText(payload))}`;
}
