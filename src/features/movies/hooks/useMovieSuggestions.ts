import { useEffect, useState } from "react";
import { searchMovies, type MovieSuggestion } from "../api/tmdb";

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

/** TMDB suggestions for the typed text, fetched after a short pause in typing. */
export function useMovieSuggestions(
  text: string,
  enabled: boolean,
): MovieSuggestion[] {
  const query = text.trim();
  const active = enabled && query.length >= MIN_QUERY_LENGTH;
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);

  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchMovies(query, controller.signal)
        .then(setSuggestions)
        .catch(() => undefined);
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [active, query]);

  // Older results stay visible while typing, so the list doesn't flicker.
  return active ? suggestions : [];
}
