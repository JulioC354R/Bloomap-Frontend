export interface BloomAreaResponse {
  bbox: {
    minLat: number;
    minLon: number;
    maxLat: number;
    maxLon: number;
  };
  center: {
    lat: number;
    lon: number;
  };
  area: string;
  locationInfo: {
    city: string;
    state: string;
    country: string;
    displayName: string;
  };
  status: string;
  indice: number;
  variacao: string;
  tendencia: string;
  historico: {
    date: string;
    ndvi: number;
  }[];
  insight: string;
}

export async function bloomArea(
  minLon: number,
  maxLon: number,
  minLat: number,
  maxLat: number
): Promise<BloomAreaResponse> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bloom/area?minLon=${minLon}&maxLon=${maxLon}&minLat=${minLat}&maxLat=${maxLat}`;

  console.log("Requisição para URL:", url);

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Bloomap/1.0 (julio@teste.com)",
    },
  });

  if (!res.ok) {
    throw new Error(`Erro na requisição: ${res.status}`);
  }

  const data: BloomAreaResponse = await res.json();
  return data;
}
