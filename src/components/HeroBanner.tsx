import { Play, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { MediaItem } from "@/lib/types";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface HeroBannerProps {
  item: MediaItem;
}

export default function HeroBanner({ item }: HeroBannerProps) {
  return (
    <div className="relative w-full h-[85vh] min-h-[500px]">
      {/* Backdrop */}
      <div className="absolute inset-0">
        <img
          src={item.backdrop}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero-bottom" />
        <div className="absolute inset-0 gradient-hero-left" />
        <div className="absolute inset-0 bg-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-end h-full pb-20 md:pb-28 px-4 md:px-12">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Tags */}
          <div className="flex gap-2 mb-4">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs font-semibold">
                {tag}
              </Badge>
            ))}
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 text-shadow-cinematic text-foreground leading-tight">
            {item.title}
          </h2>

          {/* Metadata */}
          <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
            <span className="text-green-400 font-semibold">{item.matchScore}% Match</span>
            <span>{item.year}</span>
            <span className="border border-muted-foreground/40 px-1.5 py-0.5 text-xs rounded">
              {item.maturityRating}
            </span>
            <span>{item.duration}</span>
            <span>{item.genre.join(" · ")}</span>
          </div>

          <p className="text-foreground/80 text-base md:text-lg mb-6 line-clamp-3 leading-relaxed">
            {item.description}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <Link
              to={`/player/${item.id}`}
              className="flex items-center gap-2 bg-foreground text-background px-6 md:px-8 py-3 rounded-md font-semibold hover:bg-foreground/80 transition-all text-sm md:text-base"
            >
              <Play className="w-5 h-5 fill-current" />
              Play
            </Link>
            <Link
              to={`/detail/${item.id}`}
              className="flex items-center gap-2 bg-muted/60 backdrop-blur-sm text-foreground px-6 md:px-8 py-3 rounded-md font-semibold hover:bg-muted/80 transition-all text-sm md:text-base"
            >
              <Info className="w-5 h-5" />
              More Info
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
