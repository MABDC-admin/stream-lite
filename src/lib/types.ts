export interface MediaItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  backdrop: string;
  genre: string[];
  year: number;
  maturityRating: string;
  duration: string;
  type: "movie" | "series";
  tags: string[];
  cast: string[];
  director: string;
  matchScore: number;
  progress?: number; // 0-100
  seasons?: number;
  episodes?: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  season: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isKids?: boolean;
}

export interface Genre {
  id: string;
  name: string;
  image: string;
}
