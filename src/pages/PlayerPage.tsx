import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Artplayer from "artplayer";
import { fetchItemDetail, getStreamUrl, getBackdropUrl } from "@/lib/api";

function flagFor(lang?: string) {
  const flags: Record<string, string> = {
    eng: "🇺🇸", spa: "🇪🇸", fra: "🇫🇷", deu: "🇩🇪", ita: "🇮🇹",
    por: "🇧🇷", nld: "🇳🇱", dan: "🇩🇰", fin: "🇫🇮", nor: "🇳🇴",
    swe: "🇸🇪", ara: "🇸🇦", jpn: "🇯🇵", kor: "🇰🇷", zho: "🇨🇳",
    hin: "🇮🇳", tha: "🇹🇭", rus: "🇷🇺", pol: "🇵🇱", tur: "🇹🇷",
  };
  return flags[lang || ""] || "🌐";
}

export default function PlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<Artplayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !containerRef.current) return;

    let destroyed = false;

    async function init() {
      try {
        setLoading(true);
        setError(null);

        const { item, subtitles, quality } = await fetchItemDetail(id!);
        if (destroyed) return;

        setTitle(item.title);

        const videoUrl = getStreamUrl(id!);
        const posterUrl = getBackdropUrl(id!, 1280);

        // Find English subtitle, prefer forced English, then default English, then first English, then any default
        const engSub =
          subtitles.find((s) => s.language === "eng" && s.isForced) ||
          subtitles.find((s) => s.language === "eng" && s.isDefault) ||
          subtitles.find((s) => s.language === "eng") ||
          subtitles.find((s) => s.isDefault) ||
          subtitles[0];

        // Build subtitle settings
        const subtitleSettings: any[] = [];
        if (subtitles.length > 0) {
          subtitleSettings.push({
            html: "💬 Subtitles",
            selector: [
              { html: "Off", url: "" },
              ...subtitles.map((s) => ({
                html: `${flagFor(s.language)} ${s.displayTitle}`,
                url: s.url,
                default: engSub?.index === s.index,
              })),
            ],
            onSelect(selected: any) {
              if (!selected.url) {
                artRef.current!.subtitle.show = false;
              } else {
                artRef.current!.subtitle.switch(selected.url, { type: "vtt", escape: false });
                artRef.current!.subtitle.show = true;
              }
              return selected.html;
            },
          });
        }

        const art = new Artplayer({
          container: containerRef.current!,
          url: videoUrl,
          poster: posterUrl,
          volume: 1,
          muted: false,
          autoplay: true,
          pip: true,
          screenshot: true,
          setting: true,
          playbackRate: true,
          aspectRatio: true,
          fullscreen: true,
          fullscreenWeb: true,
          miniProgressBar: true,
          mutex: true,
          backdrop: true,
          playsInline: true,
          autoPlayback: true,
          airplay: true,
          theme: "hsl(0, 72%, 51%)",
          hotkey: true,
          autoOrientation: true,
          lock: true,
          subtitle: engSub
            ? {
                url: engSub.url,
                type: "vtt",
                encoding: "utf-8",
                escape: false,
                style: {
                  color: "#fff",
                  fontSize: "22px",
                  textShadow: "0 2px 4px rgba(0,0,0,0.9)",
                  fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
                },
              }
            : {},
          settings: subtitleSettings,
        });

        artRef.current = art;

        // Force unmute and full volume
        art.on("ready", () => {
          art.muted = false;
          art.volume = 1;
        });

        setLoading(false);
      } catch (e: any) {
        if (!destroyed) {
          setError(e.message || "Failed to load");
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      destroyed = true;
      if (artRef.current) {
        try { artRef.current.destroy(true); } catch {}
        artRef.current = null;
      }
    };
  }, [id]);

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* Back button overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-sm md:text-base font-medium">{title}</span>
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Loading stream...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4 text-center px-4">
            <p className="text-foreground text-lg font-bold">Playback Error</p>
            <p className="text-muted-foreground text-sm max-w-md">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-semibold hover:bg-primary/80 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* ArtPlayer container */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ aspectRatio: "unset" }}
      />
    </div>
  );
}
