import { useParams, Link } from "react-router-dom";
import { allMedia } from "@/lib/mockData";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, SkipForward, Subtitles, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlayerPage() {
  const { id } = useParams();
  const item = allMedia.find((m) => m.id === id);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showNextEp, setShowNextEp] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) {
          setShowNextEp(true);
          return p;
        }
        return p + 0.5;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [playing]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const reset = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };
    window.addEventListener("mousemove", reset);
    reset();
    return () => {
      window.removeEventListener("mousemove", reset);
      clearTimeout(timeout);
    };
  }, []);

  if (!item) return null;

  const formatTime = (pct: number) => {
    const total = 120; // 2h in minutes
    const elapsed = Math.floor((pct / 100) * total);
    const h = Math.floor(elapsed / 60);
    const m = elapsed % 60;
    return `${h}:${m.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full h-screen bg-background cursor-none overflow-hidden" style={{ cursor: showControls ? 'auto' : 'none' }}>
      {/* Video placeholder */}
      <div className="absolute inset-0">
        <img src={item.backdrop} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/30" />
      </div>

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute inset-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-b from-background/80 to-transparent">
              <Link to={`/detail/${item.id}`} className="flex items-center gap-3 text-foreground">
                <ArrowLeft className="w-6 h-6" />
                <span className="text-sm md:text-base font-medium">
                  {item.title}
                  {item.type === "series" && " — S1:E1"}
                </span>
              </Link>
            </div>

            {/* Center play/pause */}
            <button
              onClick={() => setPlaying(!playing)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center hover:bg-foreground/30 transition-colors"
            >
              {playing ? (
                <Pause className="w-8 h-8 md:w-10 md:h-10 text-foreground" />
              ) : (
                <Play className="w-8 h-8 md:w-10 md:h-10 text-foreground fill-current ml-1" />
              )}
            </button>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background/80 to-transparent">
              {/* Progress bar */}
              <div className="relative w-full h-1 bg-muted rounded-full mb-4 group cursor-pointer">
                <div className="h-full bg-primary rounded-full relative" style={{ width: `${progress}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => setPlaying(!playing)} className="text-foreground hover:text-primary transition-colors">
                    {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                  </button>
                  <button className="text-foreground hover:text-primary transition-colors">
                    <SkipForward className="w-6 h-6" />
                  </button>
                  <button onClick={() => setMuted(!muted)} className="text-foreground hover:text-primary transition-colors">
                    {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(progress)} / 2:00:00
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <button className="text-foreground hover:text-primary transition-colors">
                    <Subtitles className="w-5 h-5" />
                  </button>
                  <button className="text-foreground hover:text-primary transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button className="text-foreground hover:text-primary transition-colors">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next episode prompt */}
      <AnimatePresence>
        {showNextEp && (
          <motion.div
            className="absolute bottom-24 right-6 z-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="bg-card/90 backdrop-blur-md rounded-lg p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Next Episode</p>
              <p className="text-sm font-bold text-foreground mb-2">Episode 2</p>
              <button className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-semibold hover:bg-foreground/80 transition-colors">
                Play Next
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
