// src/types/info.ts
export type BloomSample = {
  date: string;     // "YYYY-MM-DD"
  bloom: number;    // 0..1
  ndvi?: number;
  is_peak?: boolean;
};

export type Info = {
  status: "alta" | "media" | "baixa";
  indice: number;
  variacao: string;
  tendencia: "subindo" | "estavel" | "caindo";
  historico: BloomSample[];
  insight: string;
  country?: string | null;
  state?: string | null;
  city?: string | null;
};
