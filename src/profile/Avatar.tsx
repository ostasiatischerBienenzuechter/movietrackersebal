interface AvatarProps {
  emoji: string | null;
  label: string;
  size?: "small" | "large";
}

export function Avatar({ emoji, label, size = "small" }: AvatarProps) {
  return (
    <span
      className={`avatar avatar-${size}`}
      title={label}
      aria-label={label}
      role="img"
    >
      {emoji ?? "👤"}
    </span>
  );
}
