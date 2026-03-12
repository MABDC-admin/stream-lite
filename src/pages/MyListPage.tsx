import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MediaCard from "@/components/MediaCard";
import { useWatchlist } from "@/lib/store";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";

export default function MyListPage() {
  const { watchlist } = useWatchlist();

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />

      <div className="px-4 md:px-12 mb-8">
        <motion.h1
          className="text-3xl md:text-5xl font-black text-foreground mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          My List
        </motion.h1>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <Bookmark className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Your list is empty</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Add movies and TV shows to your list to watch them later. Browse and click the + button on any title.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 px-4 md:px-12">
          {watchlist.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
}
