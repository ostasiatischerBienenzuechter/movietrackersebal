import { useState } from "react";
import { isFirebaseConfigured } from "@/config/firebase";
import {
  CreateListScreen,
  createListId,
  SharePanel,
  useListId,
} from "@/features/list";
import { MovieScreen, updateAddedBy } from "@/features/movies";
import { ProfileForm, useProfile, type ProfileInput } from "@/features/profile";
import { Header } from "./Header";

type Screen = "movies" | "share" | "editProfile";

export function App() {
  if (!isFirebaseConfigured()) {
    return (
      <main className="centered">
        <div className="card">
          <h1>Fast fertig</h1>
          <p>
            Trage die Firebase-Konfiguration in{" "}
            <code>src/config/firebase.ts</code> ein.
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
