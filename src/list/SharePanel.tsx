import { useState } from "react";
import { shareUrl } from "./listId";

interface SharePanelProps {
  listId: string;
  onClose: () => void;
}

export function SharePanel({ listId, onClose }: SharePanelProps) {
  const url = shareUrl(window.location, listId);
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator.share === "function";

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  async function share() {
    try {
      await navigator.share({ title: "Movietracker", url });
    } catch {
      // Cancelled by the user.
    }
  }

  return (
    <main className="centered">
      <div className="card">
        <h2>Liste teilen</h2>
        <p>
          Schicke diesen Link an dein Gegenüber. Behandle ihn wie ein Passwort:
          Wer ihn hat, kann die Liste bearbeiten.
        </p>
        <input
          readOnly
          value={url}
          aria-label="Link zur Liste"
          onFocus={(e) => e.target.select()}
        />
        <div className="row">
          {canShare && (
            <button type="button" onClick={() => void share()}>
              Teilen
            </button>
          )}
          <button type="button" onClick={() => void copy()}>
            {copied ? "Kopiert ✓" : "Link kopieren"}
          </button>
        </div>
        <button type="button" className="primary" onClick={onClose}>
          Fertig
        </button>
      </div>
    </main>
  );
}
