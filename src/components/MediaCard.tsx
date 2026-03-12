import { Play, Plus, ThumbsUp, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { MediaItem } from "@/lib/types";
import { motion } from "framer-motion";

interface MediaCardProps {
  item: MediaItem;
  rank?: number;
  showProgress?: boolean;
}

export default function MediaCard({ item, rank, showProgress }: MediaCardProps) {
  return (
    <Link to={`/detail/${item.id}`} className="block group/card relative">
      <motion.div
        className="relative rounded-md overflow-hidden bg-card transition-all duration-300 group-hover/card:scale-105 group-hover/card:z-10 group-hover/card:shadow-[var(--shadow-cinematic)]"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[2/3]">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />

          {/* Rank */}
          {rank !== undefined && (
            <div className="absolute -left-1 bottom-2 text-7xl font-black text-foreground/20 leading-none select-none" style={{ WebkitTextStroke: '2px hsl(var(--foreground) / 0.4)' }}>
              {rank}
            </div>
          )}

          {/* Progress bar */}
          {(showProgress || item.progress) && item.progress && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
              <div
                className="h-full bg-primary"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
          <div className="bg-card/95 backdrop-blur-sm rounded-b-md p-3 -mx-3 -mb-3">
            <div className="flex gap-2 mb-2">
              <Link
                to={`/player/${item.id}`}
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center hover:bg-foreground/80 transition-colors"
              >
                <Play className="w-4 h-4 text-background fill-current" />
              </Link>
              <button className="w-8 h-8 rounded-full border-2 border-muted-foreground/50 flex items-center justify-center hover:border-foreground transition-colors">
                <Plus className="w-4 h-4 text-foreground" />
              </button>
              <button className="w-8 h-8 rounded-full border-2 border-muted-foreground/50 flex items-center justify-center hover:border-foreground transition-colors">
                <ThumbsUp className="w-4 h-4 text-foreground" />
              </button>
            </div>
            <p className="text-xs font-bold text-foreground truncate">{item.title}</p>
            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
              <span className="text-green-400 font-bold">{item.matchScore}%</span>
              <span>{item.maturityRating}</span>
              <span>{item.year}</span>
            </div>
            <div className="flex gap-1 mt-1">
              {item.genre.slice(0, 2).map((g) => (
                <span key={g} className="text-[10px] text-muted-foreground">{g}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
