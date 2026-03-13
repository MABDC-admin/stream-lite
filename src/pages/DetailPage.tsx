import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ContentRow from "@/components/ContentRow";
import Footer from "@/components/Footer";
import { Play, Plus, ThumbsUp, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useWatchlist } from "@/lib/store";
import { useState, useEffect } from "react";
import { fetchItemDetail, getBackdropUrl } from "@/lib/api";
import { useApiItems } from "@/hooks/useApiItems";
import { MediaItem } from "@/lib/types";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [item, setItem] = useState<MediaItem | null>(null);
  const [quality, setQuality] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch related items from same type
  const { items: related } = useApiItems({
    type: item?.type === "series" ? "Series" : "Movie",
    limit: 20,
    enabled: !!item,
  });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);

    fetchItemDetail(id).then(({ item: fetched, quality: q }) => {
      if (cancelled) return;
      setItem(fetched);
      setQuality(q);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <p className="text-foreground">Content not found</p>
      </div>
    );
  }

  const inList = isInWatchlist(item.id);
  const filteredRelated = related.filter((m) => m.id !== item.id).slice(0, 15);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Backdrop */}
      <div className="relative w-full h-[70vh] min-h-[400px]">
        <img src={getBackdropUrl(item.id)} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero-bottom" />
        <div className="absolute inset-0 gradient-hero-left" />
        <div className="absolute inset-0 bg-background/20" />
      </div>

      {/* Content */}
      <div className="-mt-48 relative z-10 px-4 md:px-12">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 text-shadow-cinematic">
            {item.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
            {item.matchScore > 0 && (
              <span className="text-green-400 font-bold text-base">⭐ {(item.matchScore / 10).toFixed(1)}</span>
            )}
            {item.year > 0 && <span>{item.year}</span>}
            <span className="border border-muted-foreground/40 px-2 py-0.5 text-xs rounded">{item.maturityRating}</span>
            {item.duration && <span>{item.duration}</span>}
            {quality && (
              <span className="bg-primary/20 text-primary px-2 py-0.5 text-xs rounded font-bold">{quality}</span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mb-6">
            <Link
              to={`/player/${item.id}`}
              className="flex items-center gap-2 bg-foreground text-background px-8 py-3 rounded-md font-semibold hover:bg-foreground/80 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              Play
            </Link>
            <button
              onClick={() => inList ? removeFromWatchlist(item.id) : addToWatchlist(item)}
              className="flex items-center gap-2 bg-muted/60 backdrop-blur-sm text-foreground px-6 py-3 rounded-md font-semibold hover:bg-muted/80 transition-all"
            >
              {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {inList ? "In My List" : "My List"}
            </button>
            <button className="w-11 h-11 rounded-full border-2 border-muted-foreground/50 flex items-center justify-center hover:border-foreground transition-colors">
              <ThumbsUp className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Description */}
          <p className="text-foreground/80 text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
            {item.description}
          </p>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-sm">
            {item.genre.length > 0 && (
              <div>
                <span className="text-muted-foreground">Genres: </span>
                <span className="text-foreground">{item.genre.join(", ")}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {filteredRelated.length > 0 && (
        <ContentRow title="More Like This" items={filteredRelated} />
      )}
      <Footer />
    </div>
  );
}
