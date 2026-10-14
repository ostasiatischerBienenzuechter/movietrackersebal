import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type Timestamp,
} from "firebase/firestore";
import { getDb } from "../firebase/firebase";
import type { Profile } from "../profile/types";
import { titleKey } from "./movieRules";
import { findPoster } from "./posterLookup";
import type { Movie } from "./types";

/** Firestore allows at most 500 writes per batch. */
const BATCH_LIMIT = 500;

function moviesCollection(listId: string) {
  return collection(getDb(), "lists", listId, "movies");
}

function toMillis(value: unknown): number | null {
  if (value == null) return null;
  return (value as Timestamp).toMillis();
}

function toProfile(value: unknown): Profile {
  const data = (value ?? {}) as Record<string, unknown>;
  return {
    id: typeof data["id"] === "string" ? data["id"] : "",
    name: typeof data["name"] === "string" ? data["name"] : "",
    emoji: typeof data["emoji"] === "string" ? data["emoji"] : "👤",
  };
}

function toMovie(id: string, data: DocumentData): Movie {
  return {
    id,
    title: String(data["title"] ?? ""),
    posterUrl: (data["posterUrl"] as string | null) ?? null,
    addedBy: toProfile(data["addedBy"]),
    createdAt: toMillis(data["createdAt"]) ?? 0,
    watchedAt: toMillis(data["watchedAt"]),
  };
}

export function subscribeToMovies(
  listId: string,
  onChange: (movies: Movie[]) => void,
  onError: (error: Error) => void,
): () => void {
  return onSnapshot(
    moviesCollection(listId),
    (snapshot) => {
      onChange(
        snapshot.docs.map((d) =>
          toMovie(d.id, d.data({ serverTimestamps: "estimate" })),
        ),
      );
    },
    onError,
  );
}

export async function addMovie(
  listId: string,
  title: string,
  addedBy: Profile,
): Promise<void> {
  const ref = await addDoc(moviesCollection(listId), {
    title,
    titleKey: titleKey(title),
    posterUrl: null,
    addedBy: { id: addedBy.id, name: addedBy.name, emoji: addedBy.emoji },
    createdAt: new Date(),
    watchedAt: null,
  });
  await updateDoc(ref, { posterUrl: await findPoster(title) });
}

export async function renameMovie(
  listId: string,
  id: string,
  title: string,
): Promise<void> {
  const ref = doc(moviesCollection(listId), id);
  await updateDoc(ref, { title, titleKey: titleKey(title), posterUrl: null });
  await updateDoc(ref, { posterUrl: await findPoster(title) });
}

export async function setWatched(
  listId: string,
  id: string,
  watched: boolean,
): Promise<void> {
  await updateDoc(doc(moviesCollection(listId), id), {
    watchedAt: watched ? new Date() : null,
  });
}

export async function deleteMovie(listId: string, id: string): Promise<void> {
  await deleteDoc(doc(moviesCollection(listId), id));
}

/** Rewrites the profile copy on every movie this profile added, so edits show on old movies too. */
export async function updateAddedBy(
  listId: string,
  profile: Profile,
): Promise<void> {
  const snapshot = await getDocs(
    query(moviesCollection(listId), where("addedBy.id", "==", profile.id)),
  );
  const addedBy = { id: profile.id, name: profile.name, emoji: profile.emoji };

  for (let i = 0; i < snapshot.docs.length; i += BATCH_LIMIT) {
    const batch = writeBatch(getDb());
    for (const d of snapshot.docs.slice(i, i + BATCH_LIMIT)) {
      batch.update(d.ref, { addedBy });
    }
    await batch.commit();
  }
}
