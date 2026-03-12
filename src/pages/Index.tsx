import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import ContentRow from "@/components/ContentRow";
import Footer from "@/components/Footer";
import {
  featured,
  trendingNow,
  continueWatching,
  topPicks,
  newReleases,
  awardWinners,
  top10,
  movies,
  tvShows,
  actionThriller,
  sciFi,
  dramas,
  genres,
} from "@/lib/mockData";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner item={featured} />

      <div className="-mt-20 relative z-10">
        <ContentRow title="Trending Now" items={trendingNow} />
        <ContentRow title="Continue Watching" items={continueWatching} />
        <ContentRow title="Top 10 in Your Country" items={top10} isTop10 />
        <ContentRow title="Top Picks for You" items={topPicks} />
        <ContentRow title="New Releases" items={newReleases} />

        {/* Browse by Genre */}
        <div className="mb-10 px-4 md:px-12">
          <h3 className="text-lg md:text-xl font-bold mb-4 text-foreground">Browse by Genre</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {genres.map((genre) => (
              <Link
                key={genre.id}
                to={`/movies?genre=${genre.id}`}
                className="relative h-28 md:h-32 rounded-md overflow-hidden group"
              >
                <img
                  src={genre.image}
                  alt={genre.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/60 group-hover:bg-background/40 transition-colors" />
                <span className="absolute inset-0 flex items-center justify-center text-foreground font-bold text-sm md:text-base">
                  {genre.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <ContentRow title="Action & Thrillers" items={actionThriller} />
        <ContentRow title="Award-Winning Titles" items={awardWinners} />
        <ContentRow title="Sci-Fi Adventures" items={sciFi} />
        <ContentRow title="TV Dramas" items={dramas.filter((d) => d.type === "series")} />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
