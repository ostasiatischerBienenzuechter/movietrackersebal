import { useEffect, useState } from "react";
import { subscribeToMovies } from "./movieRepository";
import type { Movie } from "./types";

interface MoviesState {
  movies: Movie[];
  loaded: boolean;
  failed: boolean;
}

export function useMovies(listId: string): MoviesState {
  const [state, setState] = useState<MoviesState>({
    movies: [],
    loaded: false,
    failed: false,
  });

  useEffect(
    () =>
      subscribeToMovies(
        listId,
        (movies) => setState({ movies, loaded: true, failed: false }),
        () => setState((s) => ({ ...s, loaded: true, failed: true })),
      ),
    [listId],
  );

  return state;
}
