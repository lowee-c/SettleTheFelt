interface ChipBadgeProps {
  name: string;
  tone?: 'neutral' | 'win' | 'loss';
  color?: string;
  background?: string; // NEW: overrides the center fill
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<NonNullable<ChipBadgeProps['size']>, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
};

const toneClasses: Record<NonNullable<ChipBadgeProps['tone']>, string> = {
  neutral: 'border-gold text-gold',
  win: 'border-win text-win',
  loss: 'border-loss text-loss',
};

function initialsFor(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ChipBadge({ name, tone = 'neutral', color, background, size = 'md' }: ChipBadgeProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-chip border-2 font-display font-semibold shadow-chip ${sizeClasses[size]} ${
        color ? '' : toneClasses[tone]
      } ${background ? '' : 'bg-felt-deep'}`}
      style={{
        ...(color ? { borderColor: color, color } : {}),
        ...(background ? { backgroundColor: background } : {}),
      }}
      aria-hidden="true"
    >
      <span className="absolute inset-1 rounded-chip border border-dashed border-current opacity-40" />
      <span className="relative">{initialsFor(name)}</span>
    </span>
  );
}