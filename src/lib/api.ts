const TOKEN = "bb0ab66d5e374faaae65d5e441b5df8a";
const BASE = "https://groot.hqmedia.world";

export { TOKEN, BASE };

export interface JellyfinItem {
  Id: string;
  Name: string;
  Overview?: string;
  ProductionYear?: number;
  CommunityRating?: number;
  OfficialRating?: string;
  Genres?: string[];
  Type: string;
  ImageTags?: { Primary?: string; Backdrop?: string };
  BackdropImageTags?: string[];
  MediaSources?: Array<{
    MediaStreams?: MediaStream[];
  }>;
  RunTimeTicks?: number;
  Status?: string;
  SeriesName?: string;
  SeasonName?: string;
  IndexNumber?: number;
  ParentIndexNumber?: number;
}

export interface MediaStream {
  Type: "Video" | "Audio" | "Subtitle";
  Index: number;
  Language?: string;
  DisplayLanguage?: string;
  DisplayTitle?: string;
  Title?: string;
  IsDefault?: boolean;
  IsForced?: boolean;
  Height?: number;
  Width?: number;
  Codec?: string;
  DeliveryMethod?: string;
  Channels?: number;
}

export function getPosterUrl(itemId: string, maxWidth = 300): string {
  return `${BASE}/Items/${itemId}/Images/Primary?maxWidth=${maxWidth}&api_key=${TOKEN}`;
}

export function getBackdropUrl(itemId: string, maxWidth = 1920): string {
  return `${BASE}/Items/${itemId}/Images/Backdrop?maxWidth=${maxWidth}&api_key=${TOKEN}`;
}

export function getStreamUrl(itemId: string): string {
  return `${BASE}/Videos/${itemId}/stream.mp4?api_key=${TOKEN}&AudioCodec=aac&AudioBitRate=320000`;
}

export function getSubtitleUrl(itemId: string, subtitleIndex: number): string {
  return `${BASE}/Videos/${itemId}/${itemId}/Subtitles/${subtitleIndex}/0/Stream.vtt?api_key=${TOKEN}`;
}

export function getQuality(streams?: MediaStream[]): string {
  if (!streams) return "";
  const v = streams.find((s) => s.Type === "Video");
  if (!v || !v.Height) return "";
  if (v.Height >= 2160) return "4K";
  if (v.Height >= 1080) return "1080p";
  if (v.Height >= 720) return "720p";
  return "SD";
}

export function ticksToRuntime(ticks?: number): string {
  if (!ticks) return "";
  const totalMin = Math.floor(ticks / 600000000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function jellyfinToMediaItem(item: JellyfinItem): import("./types").MediaItem {
  const quality = getQuality(item.MediaSources?.[0]?.MediaStreams);
  return {
    id: item.Id,
    title: item.Name,
    description: item.Overview || "",
    thumbnail: item.ImageTags?.Primary ? getPosterUrl(item.Id) : "",
    backdrop: (item.BackdropImageTags?.length ?? 0) > 0 || item.ImageTags?.Primary
      ? getBackdropUrl(item.Id)
      : "",
    genre: item.Genres || [],
    year: item.ProductionYear || 0,
    maturityRating: item.OfficialRating || "NR",
    duration: ticksToRuntime(item.RunTimeTicks),
    type: item.Type === "Series" ? "series" : "movie",
    tags: quality ? [quality] : [],
    cast: [],
    director: "",
    matchScore: item.CommunityRating ? Math.round(item.CommunityRating * 10) : 0,
  };
}

export interface FetchOptions {
  type?: "Movie" | "Series";
  search?: string;
  genreId?: string;
  startIndex?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export async function fetchItems(opts: FetchOptions = {}): Promise<{
  items: import("./types").MediaItem[];
  total: number;
}> {
  const {
    type = "Movie",
    search,
    genreId,
    startIndex = 0,
    limit = 40,
    sortBy = "SortName",
    sortOrder = "Ascending",
  } = opts;

  let url = `${BASE}/Items?IncludeItemTypes=${type}&Recursive=true`
    + `&Fields=Genres,Overview,ProductionYear,CommunityRating,OfficialRating`
    + `&SortBy=${sortBy}&SortOrder=${sortOrder}`
    + `&StartIndex=${startIndex}&Limit=${limit}`
    + `&api_key=${TOKEN}`;

  if (search) url += `&SearchTerm=${encodeURIComponent(search)}`;
  if (genreId) url += `&GenreIds=${genreId}`;

  const res = await fetch(url);
  if (!res.ok) {
    const errText = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${errText}`);
  }
  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON from API: ${text.slice(0, 100)}`);
  }

  return {
    items: (data.Items || []).map(jellyfinToMediaItem),
    total: data.TotalRecordCount || 0,
  };
}

export async function fetchItemDetail(itemId: string): Promise<{
  item: import("./types").MediaItem;
  subtitles: Array<{ index: number; language: string; displayTitle: string; isDefault: boolean; isForced: boolean; url: string }>;
  quality: string;
  raw: JellyfinItem;
}> {
  const res = await fetch(`${BASE}/Items/${itemId}?Fields=MediaStreams,Genres,Overview,ProductionYear,CommunityRating,OfficialRating,MediaSources&api_key=${TOKEN}`);
  const data: JellyfinItem = await res.json();

  const streams = data.MediaSources?.[0]?.MediaStreams || [];
  const quality = getQuality(streams);

  const subtitles = streams
    .filter((s) => s.Type === "Subtitle")
    .map((s) => ({
      index: s.Index,
      language: s.Language || "und",
      displayTitle: s.DisplayTitle || s.Title || s.DisplayLanguage || s.Language || "Unknown",
      isDefault: s.IsDefault || false,
      isForced: s.IsForced || false,
      url: getSubtitleUrl(itemId, s.Index),
    }));

  return {
    item: jellyfinToMediaItem(data),
    subtitles,
    quality,
    raw: data,
  };
}

// Genre lists from the API
export const MOVIE_GENRES = [
  { id: "19731", name: "Action" }, { id: "19781", name: "Adventure" }, { id: "24641", name: "Animation" },
  { id: "56875", name: "Biography" }, { id: "19732", name: "Comedy" }, { id: "20146", name: "Crime" },
  { id: "19760", name: "Documentary" }, { id: "19778", name: "Drama" }, { id: "19973", name: "Family" },
  { id: "19780", name: "Fantasy" }, { id: "19708", name: "Horror" }, { id: "67129", name: "Musical" },
  { id: "19707", name: "Mystery" }, { id: "19779", name: "Romance" }, { id: "57490", name: "Sci-Fi" },
  { id: "19892", name: "Science Fiction" }, { id: "19709", name: "Thriller" }, { id: "20692", name: "War" },
  { id: "23387", name: "Western" },
];

export const SERIES_GENRES = [
  { id: "701861", name: "Action & Adventure" }, { id: "701048", name: "Anime" }, { id: "701005", name: "Children" },
  { id: "19732", name: "Comedy" }, { id: "20146", name: "Crime" }, { id: "19760", name: "Documentary" },
  { id: "19778", name: "Drama" }, { id: "19973", name: "Family" }, { id: "19780", name: "Fantasy" },
  { id: "19708", name: "Horror" }, { id: "19707", name: "Mystery" }, { id: "701497", name: "Reality" },
  { id: "19779", name: "Romance" }, { id: "701862", name: "Sci-Fi & Fantasy" }, { id: "19709", name: "Thriller" },
  { id: "20692", name: "War" }, { id: "23387", name: "Western" },
];
