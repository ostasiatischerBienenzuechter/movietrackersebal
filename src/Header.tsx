import { Avatar } from "./profile/Avatar";
import type { Profile } from "./profile/types";

interface HeaderProps {
  profile: Profile | null;
  onEditProfile?: () => void;
  onShare?: () => void;
}

export function Header({ profile, onEditProfile, onShare }: HeaderProps) {
  return (
    <header className="header">
      <span className="brand">🎬 Movietracker</span>
      <div className="header-actions">
        {onShare != null && (
          <button type="button" onClick={onShare}>
            Teilen
          </button>
        )}
        {profile != null && onEditProfile != null && (
          <button
            type="button"
            onClick={onEditProfile}
            aria-label="Profil bearbeiten"
          >
            <Avatar emoji={profile.emoji} label={profile.name} />
            <span className="profile-name">{profile.name}</span>
          </button>
        )}
      </div>
    </header>
  );
}
