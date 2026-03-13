import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import ContentRow from "@/components/ContentRow";
import Footer from "@/components/Footer";
import { useApiItems } from "@/hooks/useApiItems";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { items: trending, loading: l1 } = useApiItems({ type: "Movie", limit: 20, sortBy: "DateCreated", sortOrder: "Descending" });
  const { items: topRated, loading: l2 } = useApiItems({ type: "Movie", limit: 20, sortBy: "CommunityRating", sortOrder: "Descending" });
  const { items: series, loading: l3 } = useApiItems({ type: "Series", limit: 20, sortBy: "DateCreated", sortOrder: "Descending" });
  const { items: action } = useApiItems({ type: "Movie", limit: 20, genreId: "19731" });
  const { items: scifi } = useApiItems({ type: "Movie", limit: 20, genreId: "57490" });
  const { items: drama } = useApiItems({ type: "Movie", limit: 20, genreId: "19778" });
  const { items: comedy } = useApiItems({ type: "Movie", limit: 20, genreId: "19732" });
  const { items: horror } = useApiItems({ type: "Movie", limit: 20, genreId: "19708" });

  const featured = trending[0] || topRated[0];
  const isLoading = l1 && l2 && l3;

  if (isLoading || !featured) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner item={featured} />

      <div className="-mt-20 relative z-10">
        <ContentRow title="🆕 Recently Added" items={trending} />
        <ContentRow title="⭐ Top Rated" items={topRated} />
        <ContentRow title="📺 TV Shows" items={series} />
        <ContentRow title="💥 Action" items={action} />
        <ContentRow title="🚀 Sci-Fi" items={scifi} />
        <ContentRow title="🎭 Drama" items={drama} />
        <ContentRow title="😂 Comedy" items={comedy} />
        <ContentRow title="👻 Horror" items={horror} />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
