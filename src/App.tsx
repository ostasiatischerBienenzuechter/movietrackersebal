import { useState } from "react";
import { isFirebaseConfigured } from "./firebase/config";
import { Header } from "./Header";
import { CreateListScreen } from "./list/CreateListScreen";
import { createListId } from "./list/listId";
import { SharePanel } from "./list/SharePanel";
import { useListId } from "./list/useListId";
import { updateAddedBy } from "./movies/movieRepository";
import { MovieScreen } from "./movies/MovieScreen";
import { ProfileForm } from "./profile/ProfileForm";
import type { ProfileInput } from "./profile/types";
import { useProfile } from "./profile/useProfile";

type Screen = "movies" | "share" | "editProfile";

export function App() {
  if (!isFirebaseConfigured()) {
    return (
      <main className="centered">
        <div className="card">
          <h1>Fast fertig</h1>
          <p>
            Trage die Firebase-Konfiguration in{" "}
            <code>src/firebase/config.ts</code> ein.
          </p>
        </div>
      </main>
    );
  }

  return <ConfiguredApp />;
}

function ConfiguredApp() {
  const [listId, openList] = useListId();
  const [profile, saveProfile] = useProfile();
  const [screen, setScreen] = useState<Screen>("movies");

  if (listId == null) {
    return (
      <>
        <Header profile={profile} />
        <CreateListScreen
          onCreate={() => {
            openList(createListId());
            setScreen("share");
          }}
        />
      </>
    );
  }

  if (profile == null) {
    return (
      <>
        <Header profile={null} />
        <main className="centered">
          <ProfileForm
            title="Wer bist du?"
            onSubmit={(input) => {
              saveProfile(input);
              return Promise.resolve();
            }}
          />
        </main>
      </>
    );
  }

  async function handleEditProfile(input: ProfileInput) {
    const next = saveProfile(input);
    if (listId != null) await updateAddedBy(listId, next);
    setScreen("movies");
  }

  const header = (
    <Header
      profile={profile}
      onEditProfile={() => setScreen("editProfile")}
      onShare={() => setScreen("share")}
    />
  );

  if (screen === "share") {
    return (
      <>
        {header}
        <SharePanel listId={listId} onClose={() => setScreen("movies")} />
      </>
    );
  }

  if (screen === "editProfile") {
    return (
      <>
        {header}
        <main className="centered">
          <ProfileForm
            title="Profil bearbeiten"
            initial={profile}
            onSubmit={handleEditProfile}
            onCancel={() => setScreen("movies")}
          />
        </main>
      </>
    );
  }

  return (
    <>
      {header}
      <MovieScreen listId={listId} profile={profile} />
    </>
  );
}
