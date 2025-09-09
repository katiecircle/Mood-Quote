import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MoodBadge } from "@/components/mood-badge";
import { getPredefinedMoods, getQuoteForMood } from "@/lib/quotes";

interface HomeProps {
  onQuoteGenerated: (quote: any, mood: string, moodData: any) => void;
}

export function Home({ onQuoteGenerated }: HomeProps) {
  const [mood, setMood] = useState("");
  const [, setLocation] = useLocation();
  const predefinedMoods = getPredefinedMoods();

  const handleMoodBadgeClick = (moodKey: string) => {
    setMood(moodKey);
  };

  const handleGetQuote = () => {
    if (!mood.trim()) {
      return;
    }

    const result = getQuoteForMood(mood);
    onQuoteGenerated(result.quote, mood, result.moodData);
    setLocation("/quote");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGetQuote();
    }
  };

  return (
    <div className="text-center animate-fade-in">
      {/* Floating Background Elements */}
      <div className="floating-elements fixed inset-0 pointer-events-none overflow-hidden" />
      
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight font-serif">
          How are you feeling today?
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Share your mood and discover a quote that speaks to your heart
        </p>
      </div>

      {/* Mood Input Card */}
      <Card className="p-8 shadow-lg mb-8 max-w-2xl mx-auto">
        <CardContent className="p-0">
          {/* Mood Input */}
          <div className="mb-6">
            <Label htmlFor="mood-input" className="block text-sm font-medium text-foreground mb-3">
              Describe your mood
            </Label>
            <Input
              id="mood-input"
              type="text"
              placeholder="e.g., anxious, excited, hopeful..."
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full"
              data-testid="input-mood"
            />
          </div>

          {/* Mood Badges */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">Or choose from these moods:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {predefinedMoods.map(({ key, data }) => (
                <MoodBadge
                  key={key}
                  emoji={data.emoji}
                  label={data.label}
                  onClick={() => handleMoodBadgeClick(key)}
                />
              ))}
            </div>
          </div>

          {/* Get Quote Button */}
          <Button
            onClick={handleGetQuote}
            disabled={!mood.trim()}
            className="w-full gradient-bg text-primary-foreground font-semibold py-4 px-6 h-auto hover:opacity-90 transition-all transform hover:scale-[1.02]"
            data-testid="button-get-quote"
          >
            Get My Quote
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
