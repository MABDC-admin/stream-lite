import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import ContentRow from "@/components/ContentRow";
import Footer from "@/components/Footer";
import { useApiItems } from "@/hooks/useApiItems";
import { SERIES_GENRES } from "@/lib/api";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function TVShowsPage() {
  const [genreId, setGenreId] = useState("");
  const { items, loading, total } = useApiItems({ type: "Series", limit: 40, genreId: genreId || undefined });
  const { items: topRated } = useApiItems({ type: "Series", limit: 20, sortBy: "CommunityRating", sortOrder: "Descending" });
  const { items: newest } = useApiItems({ type: "Series", limit: 20, sortBy: "DateCreated", sortOrder: "Descending" });

  const featured = items[0] || topRated[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {featured ? <HeroBanner item={featured} /> : (
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      )}

      <div className="-mt-20 relative z-10">
        <div className="flex items-center gap-2 px-4 md:px-12 mb-6 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setGenreId("")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              !genreId ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            All
          </button>
          {SERIES_GENRES.map((g) => (
            <button
              key={g.id}
              onClick={() => setGenreId(g.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                genreId === g.id ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {loading && items.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <>
            <ContentRow title={genreId ? `${SERIES_GENRES.find(g => g.id === genreId)?.name || "Shows"}` : "All TV Shows"} items={items} />
            {!genreId && (
              <>
                <ContentRow title="⭐ Top Rated" items={topRated} />
                <ContentRow title="🆕 Recently Added" items={newest} />
              </>
            )}
          </>
        )}

        <p className="text-center text-muted-foreground text-sm mb-8">{total.toLocaleString()} shows available</p>
      </div>
      <Footer />
    </div>
  );
}
