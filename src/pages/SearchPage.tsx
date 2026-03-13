import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MediaCard from "@/components/MediaCard";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchItems, MOVIE_GENRES } from "@/lib/api";
import { MediaItem } from "@/lib/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setSearched(true);
      try {
        const [movies, series] = await Promise.all([
          fetchItems({ type: "Movie", search: query, limit: 30 }),
          fetchItems({ type: "Series", search: query, limit: 20 }),
        ]);
        setResults([...movies.items, ...series.items]);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [query]);

  const searchGenre = async (genreId: string, genreName: string) => {
    setQuery(genreName);
    setLoading(true);
    setSearched(true);
    try {
      const data = await fetchItems({ type: "Movie", genreId, limit: 40 });
      setResults(data.items);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />

      <div className="px-4 md:px-12 mb-8">
        <div className="relative max-w-2xl mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, shows..."
            className="w-full bg-secondary border border-border rounded-lg pl-12 pr-12 py-4 text-foreground text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </motion.div>
          ) : searched ? (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-muted-foreground mb-4">
                {results.length} result{results.length !== 1 && "s"}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {results.map((item) => (
                  <MediaCard key={item.id} item={item} />
                ))}
              </div>
              {results.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-xl font-bold text-foreground mb-2">No results found</p>
                  <p className="text-muted-foreground">Try a different search term</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="suggestions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-lg font-bold text-foreground mb-4">Browse by Genre</h3>
              <div className="flex flex-wrap gap-2">
                {MOVIE_GENRES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => searchGenre(g.id, g.name)}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-accent transition-colors"
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
