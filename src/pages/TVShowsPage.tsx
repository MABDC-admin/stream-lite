import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import ContentRow from "@/components/ContentRow";
import Footer from "@/components/Footer";
import { tvShows, dramas, allMedia } from "@/lib/mockData";

export default function TVShowsPage() {
  const series = allMedia.filter((m) => m.type === "series");
  const featured = series[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner item={featured} />
      <div className="-mt-20 relative z-10">
        <ContentRow title="Popular Series" items={series} />
        <ContentRow title="TV Dramas" items={dramas.filter((d) => d.type === "series")} />
        <ContentRow title="Trending Shows" items={series.filter((s) => s.tags.includes("Trending"))} />
      </div>
      <Footer />
    </div>
  );
}
