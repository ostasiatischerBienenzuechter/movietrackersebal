import { randomId } from "@/shared/lib/randomId";

const LIST_ID_LENGTH = 24;
const LIST_ID_PATTERN = /^[A-Za-z0-9]{20,64}$/;
const HASH_PATTERN = /^#\/l\/([^/?#]+)$/;

export function createListId(): string {
  return randomId(LIST_ID_LENGTH);
}

export function isValidListId(value: string): boolean {
  return LIST_ID_PATTERN.test(value);
}

/** Extracts the list ID from a `#/l/<listId>` hash; anything else yields null. */
export function listIdFromHash(hash: string): string | null {
  const id = HASH_PATTERN.exec(hash)?.[1];
  return id != null && isValidListId(id) ? id : null;
}

export function listHash(listId: string): string {
  return `#/l/${listId}`;
}

export function shareUrl(
  location: Pick<Location, "origin" | "pathname">,
  listId: string,
): string {
  return `${location.origin}${location.pathname}${listHash(listId)}`;
}
