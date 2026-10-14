import MovieRounded from "@mui/icons-material/MovieRounded";

interface CreateListScreenProps {
  onCreate: () => void;
}

export function CreateListScreen({ onCreate }: CreateListScreenProps) {
  return (
    <main className="centered">
      <div className="card">
        <h1 className="brand-title">
          <MovieRounded fontSize="inherit" /> Movietracker
        </h1>
        <p>
          Erstelle eine neue Liste und schicke den Link an dein Gegenüber. Wer
          den Link hat, kann die Liste sehen und bearbeiten.
        </p>
        <p className="muted">
          Habt ihr schon eine Liste? Dann öffne einfach den geteilten Link.
        </p>
        <button type="button" className="primary" onClick={onCreate}>
          Neue Liste erstellen
        </button>
      </div>
    </main>
  );
}
