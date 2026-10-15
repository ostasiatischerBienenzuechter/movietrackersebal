import { useState, type FormEvent } from "react";
import type { MovieSuggestion } from "../api/tmdb";
import { useMovieSuggestions } from "../hooks/useMovieSuggestions";
import { TITLE_MAX_LENGTH, type TitleInput } from "../types";
import { TitleCombobox } from "./TitleCombobox";

interface TitleFormProps {
  initialTitle?: string;
  placeholder: string;
  submitLabel: string;
  /** Resolves to true when the title was accepted. */
  onSubmit: (input: TitleInput) => Promise<boolean>;
  onCancel?: () => void;
}

export function TitleForm({
  initialTitle = "",
  placeholder,
  submitLabel,
  onSubmit,
  onCancel,
}: TitleFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [picked, setPicked] = useState<MovieSuggestion | null>(null);
  const [busy, setBusy] = useState(false);
  // No suggestions for the untouched title when editing, nor right after a pick.
  const suggestions = useMovieSuggestions(
    title,
    picked == null && title !== initialTitle,
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (title.trim() === "") return;
    setBusy(true);
    const accepted = await onSubmit({
      title,
      posterUrl: picked?.posterUrl ?? undefined,
    });
    setBusy(false);
    if (accepted && initialTitle === "") {
      setTitle("");
      setPicked(null);
    }
  }

  return (
    <form className="title-form" onSubmit={handleSubmit}>
      <TitleCombobox
        value={title}
        suggestions={suggestions}
        placeholder={placeholder}
        maxLength={TITLE_MAX_LENGTH}
        autoFocus={initialTitle !== ""}
        onChange={(value) => {
          setTitle(value);
          setPicked(null);
        }}
        onPick={(suggestion) => {
          setTitle(suggestion.title.slice(0, TITLE_MAX_LENGTH));
          setPicked(suggestion);
        }}
      />
      <button
        type="submit"
        className="primary"
        disabled={busy || title.trim() === ""}
      >
        {submitLabel}
      </button>
      {onCancel != null && (
        <button type="button" onClick={onCancel}>
          Abbrechen
        </button>
      )}
    </form>
  );
}
