import { useState } from "react";
import type { Profile } from "../profile/types";
import { MovieItem } from "./MovieItem";
import {
  addMovie,
  deleteMovie,
  renameMovie,
  setWatched,
} from "./movieRepository";
import { findDuplicate, moviesForView } from "./movieRules";
import { TitleForm } from "./TitleForm";
import type { Movie, MovieView } from "./types";
import { useMovies } from "./useMovies";

interface MovieScreenProps {
  listId: string;
  profile: Profile;
}

type Notice =
  { kind: "duplicate"; movie: Movie } | { kind: "error"; text: string };

export function MovieScreen({ listId, profile }: MovieScreenProps) {
  const { movies, loaded, failed } = useMovies(listId);
  const [view, setView] = useState<MovieView>("watchlist");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);

  const visible = moviesForView(movies, view, search);

  async function run(action: () => Promise<void>) {
    try {
      await action();
    } catch {
      setNotice({
        kind: "error",
        text: "Das hat nicht geklappt. Bitte nochmal versuchen.",
      });
    }
  }

  function rejectDuplicate(title: string, ignoreId?: string): boolean {
    const duplicate = findDuplicate(movies, title, ignoreId);
    if (duplicate == null) return false;
    setNotice({ kind: "duplicate", movie: duplicate });
    return true;
  }

  async function handleAdd(title: string): Promise<boolean> {
    if (rejectDuplicate(title)) return false;
    setNotice(null);
    await run(() => addMovie(listId, title, profile));
    return true;
  }

  async function handleRename(movie: Movie, title: string): Promise<boolean> {
    if (rejectDuplicate(title, movie.id)) return false;
    setNotice(null);
    if (title !== movie.title) {
      await run(() => renameMovie(listId, movie.id, title));
    }
    return true;
  }

  function handleDelete(movie: Movie) {
    if (!window.confirm(`„${movie.title}“ wirklich löschen?`)) return;
    void run(() => deleteMovie(listId, movie.id));
  }

  function moveBack(movie: Movie) {
    setNotice(null);
    void run(() => setWatched(listId, movie.id, false));
  }

  function renderList() {
    if (failed) {
      return (
        <p className="empty">
          Die Liste konnte nicht geladen werden. Stimmt der Link?
        </p>
      );
    }
    if (!loaded) return <p className="empty">Lädt…</p>;
    if (visible.length === 0) {
      return (
        <p className="empty">
          {search === "" ? "Noch keine Filme hier." : "Nichts gefunden."}
        </p>
      );
    }
    return (
      <ul className="movie-list">
        {visible.map((movie) => (
          <MovieItem
            key={movie.id}
            title={movie.title}
            posterUrl={movie.posterUrl}
            watched={movie.watchedAt != null}
            adder={movie.addedBy}
            onRename={(title) => handleRename(movie, title)}
            onToggleWatched={() =>
              void run(() =>
                setWatched(listId, movie.id, movie.watchedAt == null),
              )
            }
            onDelete={() => handleDelete(movie)}
          />
        ))}
      </ul>
    );
  }

  return (
    <main className="movies">
      <nav className="tabs">
        <button
          type="button"
          className={view === "watchlist" ? "tab active" : "tab"}
          onClick={() => setView("watchlist")}
        >
          Watchlist
        </button>
        <button
          type="button"
          className={view === "watched" ? "tab active" : "tab"}
          onClick={() => setView("watched")}
        >
          Gesehen
        </button>
      </nav>

      {view === "watchlist" && (
        <TitleForm
          placeholder="Neuer Film…"
          submitLabel="Hinzufügen"
          onSubmit={handleAdd}
        />
      )}

      {notice?.kind === "duplicate" && (
        <div className="notice">
          {notice.movie.watchedAt == null ? (
            <span>„{notice.movie.title}“ steht schon auf der Watchlist.</span>
          ) : (
            <>
              <span>„{notice.movie.title}“ habt ihr schon gesehen.</span>
              <button type="button" onClick={() => moveBack(notice.movie)}>
                Zurück auf die Watchlist
              </button>
            </>
          )}
          <button
            type="button"
            className="icon"
            aria-label="Schließen"
            onClick={() => setNotice(null)}
          >
            ✖️
          </button>
        </div>
      )}
      {notice?.kind === "error" && (
        <div className="notice error">
          <span>{notice.text}</span>
          <button
            type="button"
            className="icon"
            aria-label="Schließen"
            onClick={() => setNotice(null)}
          >
            ✖️
          </button>
        </div>
      )}

      <input
        className="search"
        type="search"
        placeholder="🔍 Suchen"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {renderList()}
    </main>
  );
}
