import type { UniversalShareObject } from "../foundation/types";
import { createShareCopyText, createUniversalShareDeepLink } from "./deepLink";

export type NativeSharePayload = {
  title: string;
  text: string;
  url: string;
};

export function createNativeSharePayload(share: UniversalShareObject, origin?: string): NativeSharePayload {
  const url = createUniversalShareDeepLink(share, origin);

  return {
    title: share.title,
    text: createShareCopyText(share, origin),
    url,
  };
}
