import { Play, Plus, ThumbsUp, ChevronDown, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";
import { MediaItem } from "@/lib/types";
import { useState, useRef, useCallback } from "react";
import { getPosterUrl, getBackdropUrl } from "@/lib/api";

interface MediaCardProps {
  item: MediaItem;
  rank?: number;
  showProgress?: boolean;
}

export default function MediaCard({ item, rank, showProgress }: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [muted, setMuted] = useState(true);
  const [imgError, setImgError] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(true);
    }, 400);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsHovered(false);
  }, []);

  // Use API image URLs
  const posterSrc = item.thumbnail || getPosterUrl(item.id);
  const backdropSrc = item.backdrop || getBackdropUrl(item.id);

  return (
    <div
      className="relative group/card"
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base card */}
      <Link to={`/detail/${item.id}`} className="block">
        <div className="relative rounded-md overflow-hidden bg-card">
          <div className="relative aspect-[2/3]">
            {!imgError ? (
              <img
                src={posterSrc}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-3xl">🎬</span>
              </div>
            )}

            {/* Rank */}
            {rank !== undefined && (
              <div
                className="absolute -left-1 bottom-2 text-7xl font-black text-foreground/20 leading-none select-none"
                style={{ WebkitTextStroke: "2px hsl(var(--foreground) / 0.4)" }}
              >
                {rank}
              </div>
            )}

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="absolute top-2 right-2">
                <span className="bg-primary/80 text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {item.tags[0]}
                </span>
              </div>
            )}

            {/* Progress bar */}
            {(showProgress || item.progress) && item.progress && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Expanded hover card — Netflix style */}
      {isHovered && (
        <div
          className="absolute z-50 -top-6 -left-6 -right-6 animate-scale-in"
          style={{ minWidth: "280px" }}
        >
          <div className="rounded-lg overflow-hidden bg-card shadow-[var(--shadow-cinematic)] ring-1 ring-border/20">
            {/* Preview image area */}
            <Link to={`/detail/${item.id}`} className="block relative">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={posterSrc}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover animate-fade-out"
                  style={{ animationDuration: "0.8s", animationFillMode: "forwards" }}
                />
                <img
                  src={backdropSrc}
                  alt={item.title}
                  className="w-full h-full object-cover animate-fade-in"
                  style={{ animationDuration: "0.8s" }}
                />

                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--foreground)) 2px, hsl(var(--foreground)) 3px)",
                  }}
                />

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted/50">
                  <div
                    className="h-full bg-primary"
                    style={{ animation: "preview-progress 8s linear forwards" }}
                  />
                </div>

                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />

                <div className="absolute bottom-3 left-3 right-12">
                  <p className="text-sm font-bold text-foreground text-shadow-cinematic truncate">
                    {item.title}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMuted(!muted);
                  }}
                  className="absolute bottom-2 right-2 w-7 h-7 rounded-full border border-muted-foreground/40 flex items-center justify-center bg-card/60 backdrop-blur-sm hover:border-foreground transition-colors"
                >
                  {muted ? (
                    <VolumeX className="w-3.5 h-3.5 text-foreground" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-foreground" />
                  )}
                </button>
              </div>
            </Link>

            {/* Info panel */}
            <div className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <Link
                  to={`/player/${item.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center hover:bg-foreground/80 transition-all hover:scale-110"
                >
                  <Play className="w-4 h-4 text-background fill-current ml-0.5" />
                </Link>
                <button className="w-9 h-9 rounded-full border-2 border-muted-foreground/40 flex items-center justify-center hover:border-foreground hover:scale-110 transition-all bg-card/80">
                  <Plus className="w-4 h-4 text-foreground" />
                </button>
                <button className="w-9 h-9 rounded-full border-2 border-muted-foreground/40 flex items-center justify-center hover:border-foreground hover:scale-110 transition-all bg-card/80">
                  <ThumbsUp className="w-4 h-4 text-foreground" />
                </button>
                <div className="flex-1" />
                <Link
                  to={`/detail/${item.id}`}
                  className="w-9 h-9 rounded-full border-2 border-muted-foreground/40 flex items-center justify-center hover:border-foreground hover:scale-110 transition-all bg-card/80"
                >
                  <ChevronDown className="w-4 h-4 text-foreground" />
                </Link>
              </div>

              <div className="flex items-center gap-2 text-xs mb-2">
                {item.matchScore > 0 && (
                  <span className="text-green-400 font-bold">⭐ {(item.matchScore / 10).toFixed(1)}</span>
                )}
                <span className="border border-muted-foreground/30 px-1 py-px text-[10px] text-muted-foreground rounded">
                  {item.maturityRating}
                </span>
                {item.duration && <span className="text-muted-foreground">{item.duration}</span>}
              </div>

              <div className="flex items-center gap-1 text-[11px] text-foreground/70">
                {item.genre.slice(0, 3).map((g, i) => (
                  <span key={g} className="flex items-center gap-1">
                    {i > 0 && <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />}
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes preview-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes scale-card-in {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-card-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
