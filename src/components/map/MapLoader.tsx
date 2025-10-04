// src/components/map/MapLoader.tsx
"use client";

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { Feature, FeatureCollection } from 'geojson';
import InfoPanel from '../panel/InfoPanel';

// 1. AQUI ESTÁ A MUDANÇA: Substituímos 'any[]' por tipos mais específicos
export type AnalysisData = {
  name: string;
  // NDVI será um array de objetos, cada um com uma data e um valor
  ndvi: Array<{
    date: string;
    value: number;
  }>;
  // Plants será um array de objetos, cada um com nome comum e científico
  plants: Array<{
    name: string;
    scientificName: string;
  }>;
};

interface MapLoaderProps {
  countriesData: FeatureCollection;
  statesData: FeatureCollection;
}

const MapLoader = ({ countriesData, statesData }: MapLoaderProps) => {
  const [selectedCountry, setSelectedCountry] = useState<Feature | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const Map = useMemo(() => dynamic(
    () => import('@/components/map/MapComponent'),
    { 
      ssr: false,
      loading: () => <p>Carregando mapa...</p> 
    }
  ), []);

  return (
    <>
      <Map 
        countriesData={countriesData} 
        statesData={statesData}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        setAnalysisData={setAnalysisData} 
      />
      
      {/* 2. ATUALIZE AQUI TAMBÉM: Passe os dados reais (ou mockados) para o InfoPanel */}
      {analysisData && <InfoPanel data={analysisData} />}
    </>
  );
};

export default MapLoader;