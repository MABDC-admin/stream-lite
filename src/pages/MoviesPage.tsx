import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import ContentRow from "@/components/ContentRow";
import Footer from "@/components/Footer";
import { movies, actionThriller, sciFi, awardWinners, allMedia } from "@/lib/mockData";
import { useState } from "react";

const sortOptions = ["Popular", "Newest", "Top Rated"];

export default function MoviesPage() {
  const [sort, setSort] = useState("Popular");
  const movieItems = allMedia.filter((m) => m.type === "movie");
  const featured = movieItems[0];

  const sorted = [...movieItems].sort((a, b) => {
    if (sort === "Newest") return b.year - a.year;
    if (sort === "Top Rated") return b.matchScore - a.matchScore;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner item={featured} />
      <div className="-mt-20 relative z-10">
        {/* Sort bar */}
        <div className="flex items-center gap-3 px-4 md:px-12 mb-6">
          {sortOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setSort(opt)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                sort === opt
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <ContentRow title="All Movies" items={sorted} />
        <ContentRow title="Action & Thriller" items={actionThriller.filter((i) => i.type === "movie")} />
        <ContentRow title="Sci-Fi" items={sciFi.filter((i) => i.type === "movie")} />
        <ContentRow title="Award Winners" items={awardWinners.filter((i) => i.type === "movie")} />
      </div>
      <Footer />
    </div>
  );
}
