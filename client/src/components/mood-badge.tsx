interface MoodBadgeProps {
  emoji: string;
  label: string;
  onClick: () => void;
}

export function MoodBadge({ emoji, label, onClick }: MoodBadgeProps) {
  // Rainbow color mapping for different moods
  const getMoodColor = (moodLabel: string) => {
    const colorMap: Record<string, string> = {
      'Happy': 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-yellow-200',
      'Sad': 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-blue-200',
      'Inspired': 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-purple-200',
      'Angry': 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-red-200',
      'Anxious': 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-orange-200',
      'Grateful': 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-200',
      'Excited': 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-pink-200',
      'Hopeful': 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-cyan-200'
    };
    return colorMap[moodLabel] || 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-gray-200';
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-sm border border-transparent transition-all cursor-pointer hover-elevate transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 shadow-lg hover:shadow-xl ${getMoodColor(label)}`}
      data-testid={`badge-mood-${label.toLowerCase()}`}
    >
      <span className="text-xl">{emoji}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
