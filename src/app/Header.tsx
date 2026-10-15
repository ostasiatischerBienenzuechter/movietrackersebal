import MovieRounded from "@mui/icons-material/MovieRounded";
import ShareRounded from "@mui/icons-material/ShareRounded";
import { Avatar, type Profile } from "@/features/profile";
import { ThemeToggle } from "@/features/theme";

interface HeaderProps {
  profile: Profile | null;
  onEditProfile?: () => void;
  onShare?: () => void;
}

export function Header({ profile, onEditProfile, onShare }: HeaderProps) {
  return (
    <header className="header">
      <span className="brand">
        <MovieRounded /> Movietracker
      </span>
      <div className="header-actions">
        <ThemeToggle />
        {onShare != null && (
          <button type="button" onClick={onShare}>
            <ShareRounded fontSize="small" />
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
