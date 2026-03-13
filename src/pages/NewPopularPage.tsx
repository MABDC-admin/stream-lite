import Navbar from "@/components/Navbar";
import ContentRow from "@/components/ContentRow";
import Footer from "@/components/Footer";
import { useApiItems } from "@/hooks/useApiItems";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function NewPopularPage() {
  const { items: newest, loading: l1 } = useApiItems({ type: "Movie", limit: 20, sortBy: "DateCreated", sortOrder: "Descending" });
  const { items: topRated } = useApiItems({ type: "Movie", limit: 20, sortBy: "CommunityRating", sortOrder: "Descending" });
  const { items: newSeries } = useApiItems({ type: "Series", limit: 20, sortBy: "DateCreated", sortOrder: "Descending" });
  const { items: topSeries } = useApiItems({ type: "Series", limit: 20, sortBy: "CommunityRating", sortOrder: "Descending" });

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
        <p className="text-muted-foreground">Discover what's trending and new on the platform.</p>
      </div>

      {l1 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          <ContentRow title="🆕 Newest Movies" items={newest} />
          <ContentRow title="⭐ Top Rated Movies" items={topRated} />
          <ContentRow title="📺 New TV Shows" items={newSeries} />
          <ContentRow title="🏆 Top Rated Shows" items={topSeries} />
        </>
      )}

      <Footer />
    </div>
  );
}
