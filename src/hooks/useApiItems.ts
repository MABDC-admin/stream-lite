import { useState, useEffect, useCallback } from "react";
import { MediaItem } from "@/lib/types";
import { fetchItems, FetchOptions } from "@/lib/api";

export function useApiItems(options: FetchOptions & { enabled?: boolean } = {}) {
  const { enabled = true, ...fetchOpts } = options;
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const key = JSON.stringify(fetchOpts);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchItems(fetchOpts)
      .then((data) => {
        if (cancelled) return;
        setItems(data.items);
        setTotal(data.total);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [key, enabled]);

  const loadMore = useCallback(async () => {
    if (loading || items.length >= total) return;
    setLoading(true);
    try {
      const data = await fetchItems({ ...fetchOpts, startIndex: items.length });
      setItems((prev) => [...prev, ...data.items]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [loading, items.length, total, key]);

  return { items, total, loading, error, loadMore, hasMore: items.length < total };
}
