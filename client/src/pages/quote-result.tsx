import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw, Copy, CheckCircle, Heart } from "lucide-react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { getDeviceId } from "@/lib/utils";

interface Quote {
  text: string;
  author: string;
}

interface MoodData {
  label: string;
  emoji: string;
}

interface QuoteResultProps {
  quote: Quote | null;
  mood: string;
  moodData: MoodData | null;
  onTryAnother: () => void;
}

export function QuoteResult({ quote, mood, moodData, onTryAnother }: QuoteResultProps) {
  const [, setLocation] = useLocation();
  const [copySuccess, setCopySuccess] = useState(false);
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!quote) {
      setLocation("/");
    }
  }, [quote, setLocation]);

  useEffect(() => {
    if (!quote) return;
    
    const checkIfFavorited = async () => {
      // Check Supabase first if configured
      if (isSupabaseConfigured()) {
        try {
          const supabase = getSupabaseClient();
          const deviceId = getDeviceId();
          if (supabase) {
            const { data, error } = await supabase
              .from("favorites")
              .select("id")
              .eq("device_id", deviceId)
              .eq("text", quote.text)
              .eq("author", quote.author)
              .single();
            if (!error && data) {
              setIsFavorited(true);
              return;
            }
          }
        } catch (_e) {
          // fall back to local
        }
      }

      // Fallback: localStorage
      try {
        const raw = localStorage.getItem("favoriteQuotes");
        const favorites: Array<{ text: string; author: string }> = raw ? JSON.parse(raw) : [];
        const exists = favorites.some((q) => q.text === quote.text && q.author === quote.author);
        setIsFavorited(exists);
      } catch (_e) {
        // ignore parse errors
      }
    };

    checkIfFavorited();
  }, [quote]);

  const handleTryAnother = () => {
    onTryAnother();
    setLocation("/");
  };

  const handleCopyQuote = async () => {
    if (!quote) return;

    const fullQuote = `"${quote.text}" — ${quote.author}`;
    
    try {
      await navigator.clipboard.writeText(fullQuote);
      setCopySuccess(true);
      toast({
        title: "Quote copied!",
        description: "The quote has been copied to your clipboard.",
      });
      
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = fullQuote;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopySuccess(true);
      toast({
        title: "Quote copied!",
        description: "The quote has been copied to your clipboard.",
      });
      
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    }
  };

  const handleFavoriteQuote = async () => {
    if (!quote) return;

    const deviceId = getDeviceId();
    const moodLabel = moodData?.label;

    // If already favorited, remove it
    if (isFavorited) {
      // Try Supabase first if configured
      if (isSupabaseConfigured()) {
        try {
          const supabase = getSupabaseClient();
          if (supabase) {
            const { error } = await supabase
              .from("favorites")
              .delete()
              .eq("device_id", deviceId)
              .eq("text", quote.text)
              .eq("author", quote.author);
            if (error) throw error;
            setIsFavorited(false);
            toast({ title: "Removed from favorites", description: "Quote removed from your favorites." });
            window.dispatchEvent(new Event("favoritesUpdated"));
            return;
          }
        } catch (_e) {
          // fall through to local storage
        }
      }

      // Fallback: localStorage
      try {
        const raw = localStorage.getItem("favoriteQuotes");
        const favorites: Array<{ text: string; author: string; mood?: string }> = raw ? JSON.parse(raw) : [];
        const updated = favorites.filter(
          (q) => !(q.text === quote.text && q.author === quote.author)
        );
        localStorage.setItem("favoriteQuotes", JSON.stringify(updated));
        window.dispatchEvent(new Event("favoritesUpdated"));
        setIsFavorited(false);
        toast({ title: "Removed from favorites", description: "Quote removed from your favorites." });
      } catch (_e) {
        toast({ title: "Could not remove favorite", description: "Storage failed. Please try again." });
      }
      return;
    }

    // Add to favorites
    // Try Supabase first if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          // Upsert to avoid duplicates per device
          const { error } = await supabase
            .from("favorites")
            .upsert(
              {
                device_id: deviceId,
                text: quote.text,
                author: quote.author,
                mood: moodLabel || null,
              },
              {
                onConflict: "device_id,text,author",
              }
            );
          if (error) throw error;
          setIsFavorited(true);
          toast({ title: "Saved to favorites", description: "Stored securely in the cloud." });
          window.dispatchEvent(new Event("favoritesUpdated"));
          return;
        }
      } catch (_e) {
        // fall through to local storage
      }
    }

    // Fallback: localStorage
    try {
      const raw = localStorage.getItem("favoriteQuotes");
      const favorites: Array<{ text: string; author: string; mood?: string }> = raw ? JSON.parse(raw) : [];
      const already = favorites.some((q) => q.text === quote.text && q.author === quote.author);
      if (already) {
        setIsFavorited(true);
        toast({ title: "Already in favorites", description: "This quote is already saved." });
        return;
      }
      const updated = [
        { text: quote.text, author: quote.author, mood: moodLabel },
        ...favorites,
      ].slice(0, 100);
      localStorage.setItem("favoriteQuotes", JSON.stringify(updated));
      window.dispatchEvent(new Event("favoritesUpdated"));
      setIsFavorited(true);
      toast({ title: "Saved to favorites", description: "Saved on this device." });
    } catch (_e) {
      toast({ title: "Could not save favorite", description: "Storage failed. Please try again." });
    }
  };

  if (!quote || !moodData) {
    return null;
  }

  return (
    <div className="text-center animate-fade-in">
      {/* Quote Card */}
      <Card className="rounded-xl p-8 md:p-12 shadow-2xl mb-8 max-w-4xl mx-auto bg-gradient-to-br from-card to-card/95">
        <CardContent className="p-0">
          {/* Mood Label */}
          <div className="mb-6">
            <Badge className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent text-accent-foreground">
              <span className="mr-2" data-testid="text-mood-emoji">{moodData.emoji}</span>
              <span data-testid="text-mood-label">Mood: {moodData.label}</span>
            </Badge>
          </div>

          {/* Quote Display */}
          <blockquote className="relative">
            <div className="absolute -top-4 -left-2 text-6xl text-primary opacity-20 font-serif">"</div>
            <p className="text-xl md:text-2xl font-serif text-foreground leading-relaxed mb-6 relative z-10" data-testid="text-quote">
              {quote.text}
            </p>
            <footer className="text-muted-foreground font-medium">
              — <cite data-testid="text-author">{quote.author}</cite>
            </footer>
            <div className="absolute -bottom-4 -right-2 text-6xl text-primary opacity-20 font-serif rotate-180">"</div>
          </blockquote>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="secondary"
          onClick={handleTryAnother}
          className="inline-flex items-center justify-center px-6 py-3 font-medium hover-elevate"
          data-testid="button-try-another"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Another Mood
        </Button>
        
        <Button
          onClick={handleFavoriteQuote}
          className={`inline-flex items-center justify-center px-6 py-3 transition-all font-medium ${
            isFavorited 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-pink-500 hover:bg-pink-600 text-white"
          }`}
          data-testid="button-favorite-quote"
        >
          <Heart className={`mr-2 h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
          {isFavorited ? "Remove" : "Favorite"}
        </Button>

        <Button
          onClick={handleCopyQuote}
          className="inline-flex items-center justify-center px-6 py-3 gradient-bg text-primary-foreground hover:opacity-90 transition-all font-medium"
          data-testid="button-copy-quote"
        >
          {copySuccess ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Quote
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
