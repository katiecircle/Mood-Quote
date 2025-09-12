import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { getDeviceId } from "@/lib/utils";

interface FavoriteQuoteItem {
  id?: string;
  text: string;
  author: string;
  mood?: string;
}

export function FavoritesPanel() {
  const [favorites, setFavorites] = useState<FavoriteQuoteItem[]>([]);

  const loadFavorites = useCallback(async () => {
    // Prefer Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseClient();
        const deviceId = getDeviceId();
        if (supabase) {
          const { data, error } = await supabase
            .from("favorites")
            .select("id, text, author, mood")
            .eq("device_id", deviceId)
            .order("created_at", { ascending: false })
            .limit(100);
          if (error) throw error;
          type FavoriteRow = { id: string; text: string; author: string; mood: string | null };
          const rows = (data || []) as FavoriteRow[];
          const list: FavoriteQuoteItem[] = rows.map((d: FavoriteRow) => ({
            id: d.id,
            text: d.text,
            author: d.author,
            mood: d.mood ?? undefined,
          }));
          setFavorites(list);
          return;
        }
      } catch (_e) {
        // fall back to local
      }
    }

    try {
      const raw = localStorage.getItem("favoriteQuotes");
      const list: FavoriteQuoteItem[] = raw ? JSON.parse(raw) : [];
      setFavorites(list);
    } catch (_e) {
      setFavorites([]);
    }
  }, []);

  const handleDeleteFavorite = useCallback(async (quote: FavoriteQuoteItem) => {
    // Try Supabase first if configured
    if (isSupabaseConfigured() && quote.id) {
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          const { error } = await supabase
            .from("favorites")
            .delete()
            .eq("id", quote.id);
          if (error) throw error;
          await loadFavorites();
          return;
        }
      } catch (_e) {
        // fall back to local
      }
    }

    // Fallback: localStorage
    try {
      const raw = localStorage.getItem("favoriteQuotes");
      const list: FavoriteQuoteItem[] = raw ? JSON.parse(raw) : [];
      const updated = list.filter(
        (q) => !(q.text === quote.text && q.author === quote.author)
      );
      localStorage.setItem("favoriteQuotes", JSON.stringify(updated));
      setFavorites(updated);
    } catch (_e) {
      // ignore errors
    }
  }, [loadFavorites]);

  useEffect(() => {
    loadFavorites();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "favoriteQuotes") {
        loadFavorites();
      }
    };

    const handleCustom = () => { void loadFavorites(); };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("favoritesUpdated", handleCustom as EventListener);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("favoritesUpdated", handleCustom as EventListener);
    };
  }, [loadFavorites]);

  return (
    <Card className="shadow-lg">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <h3 className="text-sm font-semibold">Favorites</h3>
          {!favorites.length && (
            <p className="text-xs text-muted-foreground mt-1">No favorites yet. Tap the Favorite button on a quote.</p>
          )}
        </div>
        <ScrollArea className="h-[420px]">
          <ul className="divide-y">
            {favorites.map((q, idx) => (
              <li key={q.id || `${q.text}-${idx}`} className="p-4 text-sm group">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    {q.mood && (
                      <div className="text-xs mb-1 text-muted-foreground">{q.mood}</div>
                    )}
                    <blockquote className="leading-relaxed">
                      <p className="mb-2">"{q.text}"</p>
                      <footer className="text-muted-foreground">— {q.author}</footer>
                    </blockquote>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFavorite(q)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1 h-auto"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}


