import Navbar from "@/components/Navbar";
import ContentRow from "@/components/ContentRow";
import Footer from "@/components/Footer";
import { trendingNow, newReleases, top10, allMedia } from "@/lib/mockData";
import { motion } from "framer-motion";

export default function NewPopularPage() {
  const comingSoon = allMedia.slice(10, 15);

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />

      <div className="px-4 md:px-12 mb-8">
        <motion.h1
          className="text-3xl md:text-5xl font-black text-foreground mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          New & Popular
        </motion.h1>
        <p className="text-muted-foreground">Discover what's trending, new, and coming soon.</p>
      </div>

      <ContentRow title="🔥 Trending Now" items={trendingNow} />
      <ContentRow title="⭐ Top 10 Today" items={top10} isTop10 />
      <ContentRow title="🆕 New Releases" items={newReleases} />
      <ContentRow title="🎬 Coming Soon" items={comingSoon} />

      <Footer />
    </div>
  );
}
