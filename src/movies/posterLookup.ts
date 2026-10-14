import { titleKey } from "./movieRules";
import { TMDB_API_KEY } from "./tmdbConfig";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w185";

export interface TmdbMovie {
  title?: string;
  original_title?: string;
  poster_path?: string | null;
  popularity?: number;
}

interface TmdbSearchResponse {
  results?: TmdbMovie[];
}

/** Splits an optional trailing year off a title, e.g. "Dune (1984)". */
export function parseTitle(title: string): { query: string; year?: string } {
  const match = /^(.*\S)\s*\((\d{4})\)$/.exec(title.trim());
  if (match?.[1] == null || match[2] == null) return { query: title.trim() };
  return { query: match[1], year: match[2] };
}

/**
 * Prefers results whose German or original title matches exactly (most popular
 * first), so "Toy Story" finds the first film and not a sequel; otherwise
 * TMDB's own relevance order decides.
 */
export function pickPoster(query: string, results: TmdbMovie[]): string | null {
  const withPoster = results.filter((r) => r.poster_path != null);
  const key = titleKey(query);
  const exact = withPoster
    .filter(
      (r) =>
        titleKey(r.title ?? "") === key ||
        titleKey(r.original_title ?? "") === key,
    )
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  const best = exact[0] ?? withPoster[0];
  return best?.poster_path == null ? null : `${IMAGE_BASE}${best.poster_path}`;
}

export function isTmdbPoster(url: string | null): boolean {
  return url?.startsWith(IMAGE_BASE) ?? false;
}

async function searchTmdb(
  query: string,
  year?: string,
): Promise<TmdbMovie[] | null> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    query,
    language: "de-DE",
    include_adult: "false",
  });
  if (year != null) params.set("year", year);
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?${params.toString()}`,
  );
  if (!response.ok) return null;
  const data = (await response.json()) as TmdbSearchResponse;
  return data.results ?? [];
}

/**
 * Looks up the movie poster on TMDB. Returns undefined when the lookup itself
 * failed (so callers can keep what they have) and null when no poster exists.
 */
export async function findPoster(
  title: string,
): Promise<string | null | undefined> {
  if (TMDB_API_KEY === "") return undefined;
  try {
    const { query, year } = parseTitle(title);
    const results = await searchTmdb(query, year);
    return results == null ? undefined : pickPoster(query, results);
  } catch {
    return undefined;
  }
}
