import { createHmac, createHash, randomBytes, randomUUID, webcrypto as nodeWebCrypto } from "crypto";
export { createHmac, createHash, randomBytes, randomUUID };
export const subtle = nodeWebCrypto.subtle;
export const getRandomValues = (arr: Uint8Array) => nodeWebCrypto.getRandomValues(arr);
