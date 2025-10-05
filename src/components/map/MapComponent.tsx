// src/components/map/MapComponent.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { reverseGeocode } from "@/utils/reverseGeocode";
import { bloomArea } from "@/utils/backendConnection";

// Importing your components
import InfoModal from "@/components/panel/InfoModal";
import BloomHistoryPanel from "@/components/panel/BloomHistoryPanel";
import RadiusSlider from "./RadiusSlider"; // Make sure the path is correct
import type { Info as HistoryInfo, BloomSample } from "@/types/info";

// --- TYPES (kept from the first version) ---
type PanelInfo = {
  status: "high" | "medium" | "low";
  index: number;
  variation: string;
  trend: "rising" | "stable" | "falling";
  history: number[];
  insight: string;
  country?: string | null;
  state?: string | null;
  city?: string | null;
};

// --- AUXILIARY COMPONENT FOR MAP EVENTS (UNIFIED) ---
interface MapEventsHandlerProps {
  radius: number;
  circlePosition: { lat: number; lng: number } | null;
  onMapClick: (lat: number, lon: number) => void;
}

function MapEventsHandler({
  radius,
  circlePosition,
  onMapClick,
}: MapEventsHandlerProps) {
  useMapEvents({
    click: (e) => onMapClick(e.latlng.lat, e.latlng.lng),
  });

  return circlePosition ? (
    <Circle
      center={[circlePosition.lat, circlePosition.lng]}
      radius={radius}
      pathOptions={{
        color: "#2E96F5",
        fillColor: "#2E96F5",
        fillOpacity: 0.3,
      }}
    />
  ) : null;
}

// --- MAIN COMPONENT (UNIFIED) ---
export default function MapComponent() {
  // Panel/History states
  const [openPanel, setOpenPanel] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [panelInfo, setPanelInfo] = useState<PanelInfo | null>(null);
  const [historyInfo, setHistoryInfo] = useState<HistoryInfo | null>(null);

  // Circle/Radius states
  const [radius, setRadius] = useState(5000); // 5km initial radius
  const [circlePosition, setCirclePosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [bbox, setBbox] = useState<number[] | null>(null);

  const center = useMemo<[number, number]>(() => [-8.05, -34.9], []);

  // Function called when clicking on the map
  const onMapClick = useCallback(
    async (lat: number, lon: number) => {
      // 1. Circle and Bounding Box logic
      setCirclePosition({ lat, lng: lon });

      const earthRadius = 6378137; // meters
      const latDelta = (radius / earthRadius) * (180 / Math.PI);
      const lngDelta =
        ((radius / earthRadius) * (180 / Math.PI)) /
        Math.cos((lat * Math.PI) / 180);

      const bboxArray = [
        lon - lngDelta, // minLng
        lat - latDelta, // minLat
        lon + lngDelta, // maxLng
        lat + latDelta, // maxLat
      ];
      setBbox(bboxArray);

      // 2. Logic to open the panel and fetch data
      setOpenPanel(true);

      try {
        // 1️⃣ Faz a requisição para o backend com o bounding box
        const [minLon, minLat, maxLon, maxLat] = bboxArray;
        const bloomData = await bloomArea(minLon, maxLon, minLat, maxLat);

        console.log("Dados recebidos do backend:", bloomData);

        // 2️⃣ Faz a geocodificação reversa (cidade/estado/país)
        const place = await reverseGeocode(lat, lon);

        // 3️⃣ Monta o objeto do painel com dados reais
        const base: PanelInfo = {
          status:
            bloomData.status === "high"
              ? "high"
              : bloomData.status === "medium"
              ? "medium"
              : "low",
          index: bloomData.indice,
          variation: bloomData.variacao,
          trend:
            bloomData.tendencia === "falling"
              ? "falling"
              : bloomData.tendencia === "rising"
              ? "rising"
              : "stable",
          history: bloomData.historico.map((h) => h.ndvi),
          insight: bloomData.insight,
          country: place?.country ?? bloomData.locationInfo.country ?? null,
          state: place?.state ?? bloomData.locationInfo.state ?? null,
          city: place?.city ?? bloomData.locationInfo.city ?? null,
        };

        setPanelInfo(base);
      } catch (err) {
        console.error("Erro ao buscar dados de florada:", err);
        // (opcional) mostrar erro no painel
      }
    },
    [radius] // Adds 'radius' as a dependency
  );

  // Function to open the history screen (unchanged)
  const handleOpenHistory = useCallback(() => {
    if (!panelInfo) return;

    const samples: BloomSample[] = toBloomSamples(panelInfo.history);
    const maxIdx = samples.reduce(
      (best, cur, i, arr) => (cur.bloom > arr[best].bloom ? i : best),
      0
    );
    if (samples.length > 0) {
      samples[maxIdx] = { ...samples[maxIdx], is_peak: true };
    }

    const infoForHistory: HistoryInfo = {
      ...panelInfo,
      history: samples,
    };

    setHistoryInfo(infoForHistory);
    setShowHistory(true);
  }, [panelInfo]);

  return (
    <div className="h-screen w-screen relative">
      <MapContainer
        center={center}
        zoom={12}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEventsHandler
          radius={radius}
          circlePosition={circlePosition}
          onMapClick={onMapClick}
        />
      </MapContainer>

      {/* UI components over the map */}
      <RadiusSlider radius={radius} setRadius={setRadius} />

      <InfoModal
        open={openPanel}
        onClose={() => setOpenPanel(false)}
        info={panelInfo}
        initialCoords={
          bbox
            ? {
                lonMin: bbox[0].toFixed(6),
                latMin: bbox[1].toFixed(6),
                lonMax: bbox[2].toFixed(6),
                latMax: bbox[3].toFixed(6),
              }
            : undefined
        }
        onOpenHistory={handleOpenHistory}
      />

      {historyInfo && (
        <BloomHistoryPanel
          open={showHistory}
          onClose={() => setShowHistory(false)}
          info={historyInfo}
        />
      )}
    </div>
  );
}

// --- AUXILIARY FUNCTIONS (kept from the first version) ---
function toBloomSamples(values: number[]): BloomSample[] {
  const out: BloomSample[] = [];
  const now = new Date();
  // N-1 weeks ago
  const start = new Date(
    now.getTime() - (values.length - 1) * 7 * 24 * 3600 * 1000
  );
  for (let i = 0; i < values.length; i++) {
    const d = new Date(start.getTime() + i * 7 * 24 * 3600 * 1000);
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
    out.push({ date, bloom: clamp01(values[i]) });
  }
  return out;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
