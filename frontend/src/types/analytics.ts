export interface TipDataPoint {
  date: string;
  amount: number;
}

export interface GenreDistribution {
  genre: string;
  value: number;
  color: string;
}

export interface TrackStats {
  name: string;
  artist: string;
  playCount: number;
  tipAmount: number;
}

export interface HeatmapData {
  date: string;
  count: number;
}

export interface FollowerGrowthPoint {
  date: string;
  followers: number;
}

export interface LiveTip {
  id: string;
  amount: number;
  userName: string;
  timestamp: number;
  x: number;
  y: number;
}
