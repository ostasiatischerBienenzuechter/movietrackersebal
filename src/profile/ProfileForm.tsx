import { useState, type FormEvent } from "react";
import { Avatar } from "./Avatar";
import { EMOJI_MAX_LENGTH, NAME_MAX_LENGTH, type ProfileInput } from "./types";

const EMOJI_SUGGESTIONS = [
  "🐻",
  "🦊",
  "🐱",
  "🐼",
  "🦄",
  "🌸",
  "⭐",
  "🍕",
  "😎",
  "❤️",
];
const DEFAULT_EMOJI = "🐻";

interface ProfileFormProps {
  title: string;
  initial?: ProfileInput;
  onSubmit: (input: ProfileInput) => Promise<void>;
  onCancel?: () => void;
}

export function ProfileForm({
  title,
  initial,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [emoji, setEmoji] = useState(initial?.emoji ?? DEFAULT_EMOJI);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const trimmedName = name.trim();
  const trimmedEmoji = emoji.trim();
  const valid = trimmedName !== "" && trimmedEmoji !== "";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!valid) return;
    setBusy(true);
    setError(null);
    try {
      await onSubmit({ name: trimmedName, emoji: trimmedEmoji });
    } catch {
      setError("Speichern fehlgeschlagen. Bitte nochmal versuchen.");
      setBusy(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{title}</h2>
      <div className="profile-preview">
        <Avatar
          emoji={trimmedEmoji === "" ? null : trimmedEmoji}
          label={trimmedName}
          size="large"
        />
      </div>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={NAME_MAX_LENGTH}
        autoFocus
      />
      <div className="emoji-grid">
        {EMOJI_SUGGESTIONS.map((value) => (
          <button
            key={value}
            type="button"
            className={emoji === value ? "emoji selected" : "emoji"}
            onClick={() => setEmoji(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <label className="field-label">
        Eigenes Emoji
        <input
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          maxLength={EMOJI_MAX_LENGTH}
          placeholder="z. B. 🎃"
        />
      </label>
      {error != null && <p className="error">{error}</p>}
      <div className="row">
        {onCancel != null && (
          <button type="button" onClick={onCancel}>
            Abbrechen
          </button>
        )}
        <button type="submit" className="primary" disabled={busy || !valid}>
          Speichern
        </button>
      </div>
    </form>
  );
}
