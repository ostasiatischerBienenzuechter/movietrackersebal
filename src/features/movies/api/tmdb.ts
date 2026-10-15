import { titleKey } from "../lib/movieRules";
import { TMDB_API_KEY } from "@/config/tmdb";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w185";

const SEARCH_URL = "https://api.themoviedb.org/3/search/movie";
const MAX_SUGGESTIONS = 6;

export interface TmdbMovie {
  id?: number;
  title?: string;
  original_title?: string;
  poster_path?: string | null;
  popularity?: number;
  release_date?: string;
}

export interface MovieSuggestion {
  tmdbId: number;
  title: string;
  year: string | null;
  posterUrl: string | null;
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
  return posterUrl(best?.poster_path);
}

export function isTmdbPoster(url: string | null): boolean {
  return url?.startsWith(IMAGE_BASE) ?? false;
}

function posterUrl(path: string | null | undefined): string | null {
  return path == null ? null : `${IMAGE_BASE}${path}`;
}

export function toSuggestions(results: TmdbMovie[]): MovieSuggestion[] {
  const seen = new Set<number>();
  const suggestions: MovieSuggestion[] = [];
  for (const r of results) {
    const title = r.title?.trim() ?? "";
    if (r.id == null || title === "" || seen.has(r.id)) continue;
    seen.add(r.id);
    suggestions.push({
      tmdbId: r.id,
      title,
      year: /^\d{4}/.exec(r.release_date ?? "")?.[0] ?? null,
      posterUrl: posterUrl(r.poster_path),
    });
    if (suggestions.length === MAX_SUGGESTIONS) break;
  }
  return suggestions;
}

async function searchTmdb(
  query: string,
  year?: string,
  signal?: AbortSignal,
): Promise<TmdbMovie[] | null> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    query,
    language: "de-DE",
    include_adult: "false",
  });
  if (year != null) params.set("year", year);
  const response = await fetch(`${SEARCH_URL}?${params.toString()}`, {
    signal,
  });
  if (!response.ok) return null;
  const data = (await response.json()) as TmdbSearchResponse;
  return data.results ?? [];
}

/** Movies matching what the user has typed so far, best matches first. */
export async function searchMovies(
  text: string,
  signal?: AbortSignal,
): Promise<MovieSuggestion[]> {
  if (TMDB_API_KEY === "") return [];
  const { query, year } = parseTitle(text);
  const results = await searchTmdb(query, year, signal);
  return toSuggestions(results ?? []);
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
