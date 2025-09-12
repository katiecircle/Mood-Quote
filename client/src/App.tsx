import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/header";
import { FavoritesPanel } from "@/components/favorites-panel";
import { Home } from "@/pages/home";
import { QuoteResult } from "@/pages/quote-result";
import NotFound from "@/pages/not-found";

interface Quote {
  text: string;
  author: string;
}

interface MoodData {
  label: string;
  emoji: string;
}

function Router() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [currentMood, setCurrentMood] = useState<string>("");
  const [currentMoodData, setCurrentMoodData] = useState<MoodData | null>(null);

  const handleQuoteGenerated = (quote: Quote, mood: string, moodData: MoodData) => {
    setCurrentQuote(quote);
    setCurrentMood(mood);
    setCurrentMoodData(moodData);
  };

  const handleTryAnother = () => {
    setCurrentQuote(null);
    setCurrentMood("");
    setCurrentMoodData(null);
  };

  return (
    <Switch>
      <Route path="/">
        <Home onQuoteGenerated={handleQuoteGenerated} />
      </Route>
      <Route path="/quote">
        <QuoteResult
          quote={currentQuote}
          mood={currentMood}
          moodData={currentMoodData}
          onTryAnother={handleTryAnother}
        />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
          <Header />
          <main className="relative z-10 flex-1 px-6 py-12">
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                <Router />
              </div>
              <aside className="hidden lg:block sticky top-8">
                <FavoritesPanel />
              </aside>
            </div>
          </main>
          <footer className="relative z-10 w-full px-6 py-8 mt-auto">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm text-muted-foreground">
                Made with ❤️ to brighten your day • 
                <a href="#" className="hover:text-foreground transition-colors ml-1" data-testid="link-privacy">Privacy Policy</a> • 
                <a href="#" className="hover:text-foreground transition-colors ml-1" data-testid="link-terms">Terms</a>
              </p>
            </div>
          </footer>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
