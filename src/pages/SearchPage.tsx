import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MediaCard from "@/components/MediaCard";
import { allMedia, genres } from "@/lib/mockData";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allMedia.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.genre.some((g) => g.toLowerCase().includes(q)) ||
        m.cast.some((c) => c.toLowerCase().includes(q)) ||
        m.director.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />

      <div className="px-4 md:px-12 mb-8">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, genres, people..."
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

        {/* Results or Suggestions */}
        <AnimatePresence mode="wait">
          {query.trim() ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-muted-foreground mb-4">
                {results.length} result{results.length !== 1 && "s"} for "{query}"
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
            <motion.div
              key="suggestions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-lg font-bold text-foreground mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {["Action", "Sci-Fi", "Drama", "Comedy", "Horror", "Thriller", "Romance"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setQuery(g)}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-accent transition-colors"
                  >
                    {g}
                  </button>
                ))}
              </div>

              <h3 className="text-lg font-bold text-foreground mb-4">Explore Genres</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => setQuery(genre.name)}
                    className="relative h-24 rounded-md overflow-hidden group"
                  >
                    <img src={genre.image} alt={genre.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-background/60 group-hover:bg-background/40 transition-colors" />
                    <span className="absolute inset-0 flex items-center justify-center text-foreground font-bold text-sm">
                      {genre.name}
                    </span>
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
