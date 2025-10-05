// src/types/info.ts
export type BloomSample = {
  date: string; // "YYYY-MM-DD"
  bloom: number; // 0..1
  ndvi?: number;
  is_peak?: boolean;
};

export type Info = {
  status: "high" | "medium" | "low";
  index: number;
  variation: string;
  trend: "rising" | "stable" | "falling";
  history: BloomSample[];
  insight: string;
  country?: string | null;
  state?: string | null;
  city?: string | null;
};
