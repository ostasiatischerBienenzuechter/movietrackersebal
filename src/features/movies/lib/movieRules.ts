import type { Movie, MovieView } from "../types";

/** Titles are compared ignoring case and leading/trailing whitespace; otherwise exactly. */
export function titleKey(title: string): string {
  return title.trim().toLowerCase();
}

export function findDuplicate(
  movies: Movie[],
  title: string,
  ignoreId?: string,
): Movie | undefined {
  const key = titleKey(title);
  return movies.find((m) => m.id !== ignoreId && titleKey(m.title) === key);
}

export function moviesForView(
  movies: Movie[],
  view: MovieView,
  search: string,
): Movie[] {
  const needle = titleKey(search);
  const matching = movies.filter(
    (m) =>
      (view === "watched" ? m.watchedAt != null : m.watchedAt == null) &&
      (needle === "" || m.title.toLowerCase().includes(needle)),
  );

  if (view === "watched") {
    return matching.sort((a, b) => (b.watchedAt ?? 0) - (a.watchedAt ?? 0));
  }
  return matching.sort((a, b) => a.createdAt - b.createdAt);
}
