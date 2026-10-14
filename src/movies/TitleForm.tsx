import { useState, type FormEvent } from "react";
import { TITLE_MAX_LENGTH } from "./types";

interface TitleFormProps {
  initialTitle?: string;
  placeholder: string;
  submitLabel: string;
  /** Resolves to true when the title was accepted. */
  onSubmit: (title: string) => Promise<boolean>;
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
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (title.trim() === "") return;
    setBusy(true);
    const accepted = await onSubmit(title);
    setBusy(false);
    if (accepted && initialTitle === "") setTitle("");
  }

  return (
    <form className="title-form" onSubmit={handleSubmit}>
      <input
        placeholder={placeholder}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={TITLE_MAX_LENGTH}
        autoFocus={initialTitle !== ""}
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
