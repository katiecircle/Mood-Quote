interface MoodBadgeProps {
  emoji: string;
  label: string;
  onClick: () => void;
}

export function MoodBadge({ emoji, label, onClick }: MoodBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-medium text-sm border border-transparent transition-all cursor-pointer hover-elevate transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      data-testid={`badge-mood-${label.toLowerCase()}`}
    >
      <span className="text-xl">{emoji}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
