import { COLLECTION_CODE_PREFIX } from "../config/inventory";

/**
 * Generates exhibition-friendly codes like MHC-2048.
 * Deterministic when sessionId is provided for stable reprint.
 */
export function generateCollectionCode(sessionId: string): string {
  let hash = 0;
  for (let i = 0; i < sessionId.length; i += 1) {
    hash = (hash * 33 + sessionId.charCodeAt(i)) % 10000;
  }
  const number = String(hash).padStart(4, "0");
  return `${COLLECTION_CODE_PREFIX}-${number}`;
}
