import { useCallback, useEffect, useState } from "react";
import { readStored, writeStored } from "@/shared/lib/storage";
import { listHash, listIdFromHash } from "../lib/listId";

const STORAGE_KEY = "gflist.listId";

/**
 * A list ID in the URL wins and is remembered; otherwise the remembered ID is used
 * and written back into the URL so the address bar always shows the share link.
 */
function resolveListId(): string | null {
  const fromHash = listIdFromHash(window.location.hash);
  if (fromHash != null) {
    writeStored(STORAGE_KEY, fromHash);
    return fromHash;
  }
  const stored = readStored(STORAGE_KEY);
  if (stored != null) window.history.replaceState(null, "", listHash(stored));
  return stored;
}

export function useListId(): [string | null, (id: string) => void] {
  const [listId, setListId] = useState<string | null>(resolveListId);

  useEffect(() => {
    const onHashChange = () => setListId(resolveListId());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const openList = useCallback((id: string) => {
    writeStored(STORAGE_KEY, id);
    window.history.replaceState(null, "", listHash(id));
    setListId(id);
  }, []);

  return [listId, openList];
}
