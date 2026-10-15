import MovieRounded from "@mui/icons-material/MovieRounded";
import { useId, useState, type KeyboardEvent } from "react";
import type { MovieSuggestion } from "../api/tmdb";

interface TitleComboboxProps {
  value: string;
  suggestions: MovieSuggestion[];
  placeholder: string;
  maxLength: number;
  autoFocus?: boolean;
  onChange: (value: string) => void;
  onPick: (suggestion: MovieSuggestion) => void;
}

export function TitleCombobox({
  value,
  suggestions,
  placeholder,
  maxLength,
  autoFocus,
  onChange,
  onPick,
}: TitleComboboxProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const expanded = open && suggestions.length > 0;
  const active = expanded ? suggestions[highlighted] : undefined;
  const optionId = (index: number) => `${listId}-${index}`;

  function pick(suggestion: MovieSuggestion) {
    onPick(suggestion);
    setOpen(false);
    setHighlighted(-1);
  }

  function move(step: number) {
    setOpen(true);
    // -1 means "nothing highlighted", so Enter submits the typed text.
    setHighlighted((i) =>
      Math.min(Math.max(i + step, -1), suggestions.length - 1),
    );
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter" && active != null) {
      e.preventDefault();
      pick(active);
    } else if (e.key === "Escape" && expanded) {
      e.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div className="combobox">
      <input
        role="combobox"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          active == null ? undefined : optionId(highlighted)
        }
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        autoFocus={autoFocus}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlighted(-1);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => setOpen(false)}
      />
      {expanded && (
        <ul className="suggestions" id={listId} role="listbox">
          {suggestions.map((s, index) => (
            <li
              key={s.tmdbId}
              id={optionId(index)}
              role="option"
              aria-selected={index === highlighted}
              className={
                index === highlighted ? "suggestion active" : "suggestion"
              }
              // Keeps focus in the input so the list doesn't close before the click lands.
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setHighlighted(index)}
              onClick={() => pick(s)}
            >
              {s.posterUrl != null ? (
                <img className="suggestion-poster" src={s.posterUrl} alt="" />
              ) : (
                <span className="suggestion-poster poster-placeholder">
                  <MovieRounded fontSize="small" />
                </span>
              )}
              <span className="suggestion-title">{s.title}</span>
              {s.year != null && (
                <span className="suggestion-year">{s.year}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
