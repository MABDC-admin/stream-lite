import { useState, useCallback } from "react";
import { MediaItem } from "./types";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem("streamflix-watchlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addToWatchlist = useCallback((item: MediaItem) => {
    setWatchlist((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      const next = [...prev, item];
      localStorage.setItem("streamflix-watchlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromWatchlist = useCallback((id: string) => {
    setWatchlist((prev) => {
      const next = prev.filter((i) => i.id !== id);
      localStorage.setItem("streamflix-watchlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const isInWatchlist = useCallback(
    (id: string) => watchlist.some((i) => i.id === id),
    [watchlist]
  );

  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist };
}
