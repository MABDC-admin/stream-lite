import { useParams, Link } from "react-router-dom";
import { allMedia } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import ContentRow from "@/components/ContentRow";
import Footer from "@/components/Footer";
import { Play, Plus, ThumbsUp, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useWatchlist } from "@/lib/store";

export default function DetailPage() {
  const { id } = useParams();
  const item = allMedia.find((m) => m.id === id);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Content not found</p>
      </div>
    );
  }

  const inList = isInWatchlist(item.id);
  const related = allMedia
    .filter((m) => m.id !== item.id && m.genre.some((g) => item.genre.includes(g)))
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Backdrop */}
      <div className="relative w-full h-[70vh] min-h-[400px]">
        <img src={item.backdrop} alt={item.title} className="w-full h-full object-cover" />
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
            <span className="text-green-400 font-bold text-base">{item.matchScore}% Match</span>
            <span>{item.year}</span>
            <span className="border border-muted-foreground/40 px-2 py-0.5 text-xs rounded">{item.maturityRating}</span>
            <span>{item.duration}</span>
            {item.seasons && <span>{item.seasons} Season{item.seasons > 1 && "s"}</span>}
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
            <div>
              <span className="text-muted-foreground">Cast: </span>
              <span className="text-foreground">{item.cast.join(", ")}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Director: </span>
              <span className="text-foreground">{item.director}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Genres: </span>
              <span className="text-foreground">{item.genre.join(", ")}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Tags: </span>
              <span className="text-foreground">{item.tags.length > 0 ? item.tags.join(", ") : "None"}</span>
            </div>
          </div>

          {/* Episodes for series */}
          {item.type === "series" && item.episodes && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-foreground mb-4">Episodes</h3>
              <div className="space-y-3">
                {item.episodes.map((ep) => (
                  <Link
                    key={ep.id}
                    to={`/player/${item.id}`}
                    className="flex gap-4 bg-card rounded-lg p-3 hover:bg-accent transition-colors group"
                  >
                    <div className="relative w-32 h-20 rounded overflow-hidden flex-shrink-0">
                      <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/40">
                        <Play className="w-8 h-8 text-foreground fill-current" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-foreground text-sm">
                          {ep.number}. {ep.title}
                        </p>
                        <span className="text-xs text-muted-foreground">{ep.duration}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ep.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <ContentRow title="More Like This" items={related} />
      <Footer />
    </div>
  );
}
