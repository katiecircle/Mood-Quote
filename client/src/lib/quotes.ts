export interface Quote {
  text: string;
  author: string;
}

export interface MoodData {
  label: string;
  emoji: string;
  quotes: Quote[];
}

export const moods: Record<string, MoodData> = {
  happy: {
    label: "Happy",
    emoji: "😊",
    quotes: [
      { text: "The best way to cheer yourself up is to try to cheer somebody else up.", author: "Mark Twain" },
      { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
      { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
      { text: "Happiness is when what you think, what you say, and what you do are in harmony.", author: "Mahatma Gandhi" },
      { text: "Most folks are as happy as they make up their minds to be.", author: "Abraham Lincoln" }
    ]
  },
  sad: {
    label: "Sad",
    emoji: "😢",
    quotes: [
      { text: "The wound is the place where the Light enters you.", author: "Rumi" },
      { text: "Every saint has a past, and every sinner has a future.", author: "Oscar Wilde" },
      { text: "The only way out is through.", author: "Robert Frost" },
      { text: "Tears are words that need to be written.", author: "Paulo Coelho" },
      { text: "The deeper that sorrow carves into your being, the more joy you can contain.", author: "Kahlil Gibran" }
    ]
  },
  inspired: {
    label: "Inspired",
    emoji: "💡",
    quotes: [
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
      { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
      { text: "Your limitation—it's only your imagination.", author: "Unknown" },
      { text: "Great things never come from comfort zones.", author: "Unknown" }
    ]
  },
  angry: {
    label: "Angry",
    emoji: "😠",
    quotes: [
      { text: "Holding onto anger is like grasping a hot coal with the intent of throwing it at someone else.", author: "Buddha" },
      { text: "For every minute you remain angry, you give up sixty seconds of peace of mind.", author: "Ralph Waldo Emerson" },
      { text: "Anger is an acid that can do more harm to the vessel in which it is stored than to anything on which it is poured.", author: "Mark Twain" },
      { text: "When angry, count to ten before you speak. If very angry, count to one hundred.", author: "Thomas Jefferson" },
      { text: "Speak when you are angry and you will make the best speech you will ever regret.", author: "Ambrose Bierce" }
    ]
  },
  anxious: {
    label: "Anxious",
    emoji: "😰",
    quotes: [
      { text: "You have been assigned this mountain to show others it can be moved.", author: "Mel Robbins" },
      { text: "Anxiety is the dizziness of freedom.", author: "Søren Kierkegaard" },
      { text: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie" },
      { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
      { text: "The cave you fear to enter holds the treasure you seek.", author: "Joseph Campbell" }
    ]
  },
  grateful: {
    label: "Grateful",
    emoji: "🙏",
    quotes: [
      { text: "Gratitude turns what we have into enough.", author: "Anonymous" },
      { text: "The unthankful heart discovers no mercies; but the thankful heart will find, in every hour, some heavenly blessings.", author: "Henry Ward Beecher" },
      { text: "Gratitude is not only the greatest of virtues but the parent of all others.", author: "Cicero" },
      { text: "Be thankful for what you have; you'll end up having more.", author: "Oprah Winfrey" },
      { text: "Gratitude makes sense of our past, brings peace for today, and creates a vision for tomorrow.", author: "Melody Beattie" }
    ]
  },
  excited: {
    label: "Excited",
    emoji: "🎉",
    quotes: [
      { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
      { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
    ]
  },
  hopeful: {
    label: "Hopeful",
    emoji: "🌟",
    quotes: [
      { text: "Hope is being able to see that there is light despite all of the darkness.", author: "Desmond Tutu" },
      { text: "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.", author: "Winston Churchill" },
      { text: "Hope is the thing with feathers that perches in the soul.", author: "Emily Dickinson" },
      { text: "Once you choose hope, anything's possible.", author: "Christopher Reeve" },
      { text: "Hope is important because it can make the present moment less difficult to bear.", author: "Thich Nhat Hanh" }
    ]
  }
};

export function getQuoteForMood(mood: string): { quote: Quote; moodData: MoodData } {
  const normalizedMood = mood.toLowerCase().trim();
  
  // Try to find exact match first
  let moodData = moods[normalizedMood];
  
  // If no exact match, try to find partial matches
  if (!moodData) {
    const moodKeys = Object.keys(moods);
    const matchingKey = moodKeys.find(key => 
      key.includes(normalizedMood) || normalizedMood.includes(key)
    );
    
    if (matchingKey) {
      moodData = moods[matchingKey];
    } else {
      // Default to happy if no match found
      moodData = moods.happy;
    }
  }
  
  // Select random quote from the mood's quotes
  const randomIndex = Math.floor(Math.random() * moodData.quotes.length);
  const quote = moodData.quotes[randomIndex];
  
  return { quote, moodData };
}

export function getPredefinedMoods(): Array<{ key: string; data: MoodData }> {
  return [
    { key: 'happy', data: moods.happy },
    { key: 'sad', data: moods.sad },
    { key: 'inspired', data: moods.inspired },
    { key: 'angry', data: moods.angry },
    { key: 'anxious', data: moods.anxious },
    { key: 'grateful', data: moods.grateful }
  ];
}
