// src/components/map/MapComponent.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { reverseGeocode } from "@/utils/reverseGeocode";

// Importando seus componentes
import InfoModal from "@/components/panel/InfoModal";
import BloomHistoryPanel from "@/components/panel/BloomHistoryPanel";
import RadiusSlider from "./RadiusSlider"; // Certifique-se que o caminho está correto
import type { Info as HistoryInfo, BloomSample } from "@/types/info";

// --- TIPOS (mantidos da primeira versão) ---
type PanelInfo = {
  status: "alta" | "media" | "baixa";
  indice: number;
  variacao: string;
  tendencia: "subindo" | "estavel" | "caindo";
  historico: number[];
  insight: string;
  country?: string | null;
  state?: string | null;
  city?: string | null;
};

// --- COMPONENTE AUXILIAR PARA EVENTOS NO MAPA (UNIFICADO) ---
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

// --- COMPONENTE PRINCIPAL (UNIFICADO) ---
export default function MapComponent() {
  // Estados do Painel/Histórico
  const [openPanel, setOpenPanel] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [panelInfo, setPanelInfo] = useState<PanelInfo | null>(null);
  const [historyInfo, setHistoryInfo] = useState<HistoryInfo | null>(null);

  // Estados do Círculo/Raio
  const [radius, setRadius] = useState(5000); // 5km de raio inicial
  const [circlePosition, setCirclePosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [bbox, setBbox] = useState<number[] | null>(null);

  const center = useMemo<[number, number]>(() => [-8.05, -34.9], []);

  // Função chamada ao clicar no mapa (unifica a lógica das duas versões)
  const onMapClick = useCallback(
    async (lat: number, lon: number) => {
      // 1. Lógica do Círculo e Bounding Box
      setCirclePosition({ lat, lng: lon });

      const earthRadius = 6378137; // metros
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

      // 2. Lógica de abrir o painel e buscar dados
      setOpenPanel(true);

      const place = await reverseGeocode(lat, lon);

      const base: PanelInfo = {
        status: "media",
        indice: 0.42,
        variacao: "+5%",
        tendencia: "subindo",
        historico: [0.12, 0.18, 0.45, 0.78, 0.41, 0.2],
        insight: "Pico recente de floração detectado em julho.",
        // Preenchemos com os dados da biblioteca.
        // O `?? null` garante que o valor seja nulo se não for encontrado.
        country: place?.country ?? null,
        state: place?.state ?? null,
        city: place?.city ?? null,
      };

      setPanelInfo(base);
    },
    [radius] // Adiciona 'radius' como dependência
  );

  // Função para abrir a tela de histórico (sem alterações)
  const handleOpenHistory = useCallback(() => {
    if (!panelInfo) return;

    const samples: BloomSample[] = toBloomSamples(panelInfo.historico);
    const maxIdx = samples.reduce(
      (best, cur, i, arr) => (cur.bloom > arr[best].bloom ? i : best),
      0
    );
    if (samples.length > 0) {
      samples[maxIdx] = { ...samples[maxIdx], is_peak: true };
    }

    const infoForHistory: HistoryInfo = {
      ...panelInfo,
      historico: samples,
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

      {/* Componentes da UI sobre o mapa */}
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

// --- FUNÇÕES AUXILIARES (mantidas da primeira versão) ---
function toBloomSamples(values: number[]): BloomSample[] {
  const out: BloomSample[] = [];
  const now = new Date();
  // N-1 semanas atrás
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
