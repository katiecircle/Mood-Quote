import { Badge } from "@/components/ui/badge";

interface MoodBadgeProps {
  emoji: string;
  label: string;
  onClick: () => void;
}

export function MoodBadge({ emoji, label, onClick }: MoodBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer hover-elevate transform hover:scale-105"
      onClick={onClick}
      data-testid={`badge-mood-${label.toLowerCase()}`}
    >
      <span className="text-xl">{emoji}</span>
      <span className="font-medium">{label}</span>
    </Badge>
  );
}
