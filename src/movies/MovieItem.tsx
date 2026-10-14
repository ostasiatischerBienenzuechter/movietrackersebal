import { useState } from "react";
import { Avatar } from "../profile/Avatar";
import { TitleForm } from "./TitleForm";

interface MovieItemProps {
  title: string;
  posterUrl: string | null;
  watched: boolean;
  adder: { name: string; emoji: string };
  onRename: (title: string) => Promise<boolean>;
  onToggleWatched: () => void;
  onDelete: () => void;
}

export function MovieItem({
  title,
  posterUrl,
  watched,
  adder,
  onRename,
  onToggleWatched,
  onDelete,
}: MovieItemProps) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="movie">
        <TitleForm
          initialTitle={title}
          placeholder="Titel"
          submitLabel="Speichern"
          onSubmit={async (next) => {
            const accepted = await onRename(next);
            if (accepted) setEditing(false);
            return accepted;
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="movie">
      {posterUrl != null ? (
        <img className="poster" src={posterUrl} alt="" loading="lazy" />
      ) : (
        <span className="poster poster-placeholder">🎬</span>
      )}
      <span className="movie-title">{title}</span>
      <Avatar
        emoji={adder.emoji}
        label={
          adder.name === "" ? "Hinzugefügt" : `Hinzugefügt von ${adder.name}`
        }
      />
      <div className="movie-actions">
        <button
          type="button"
          className="icon"
          aria-label={
            watched ? "Zurück auf die Watchlist" : "Als gesehen markieren"
          }
          onClick={onToggleWatched}
        >
          {watched ? "↩️" : "✅"}
        </button>
        <button
          type="button"
          className="icon"
          aria-label="Bearbeiten"
          onClick={() => setEditing(true)}
        >
          ✏️
        </button>
        <button
          type="button"
          className="icon"
          aria-label="Löschen"
          onClick={onDelete}
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
