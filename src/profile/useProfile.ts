import { useCallback, useState } from "react";
import { randomId } from "../randomId";
import { loadProfile, saveProfile } from "./profileStorage";
import type { Profile, ProfileInput } from "./types";

/** Saves the profile, keeping its ID when editing so the user's movies can be found again. */
export function useProfile(): [
  Profile | null,
  (input: ProfileInput) => Profile,
] {
  const [profile, setProfile] = useState<Profile | null>(loadProfile);

  const update = useCallback(
    (input: ProfileInput) => {
      const next: Profile = { id: profile?.id ?? randomId(20), ...input };
      saveProfile(next);
      setProfile(next);
      return next;
    },
    [profile],
  );

  return [profile, update];
}
