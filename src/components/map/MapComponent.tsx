// src/components/map/MapComponent.tsx
"use client";

import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { Layer, LeafletEvent } from 'leaflet';
import { Feature, FeatureCollection } from 'geojson';
import { AnalysisData } from './MapLoader';
import { useCallback, useEffect } from 'react';

// Criamos um componente interno para ter acesso ao mapa
const MapEvents = ({ selectedCountry }: { selectedCountry: Feature | null }) => {
  const map = useMap(); // Este hook nos dá acesso à instância do mapa

  useEffect(() => {
    // Este efeito vai rodar TODA VEZ que o 'selectedCountry' mudar
    if (selectedCountry) {
      const bounds = new L.GeoJSON(selectedCountry).getBounds();
      map.flyToBounds(bounds, { padding: [50, 50] });
    }
  }, [selectedCountry, map]); // As dependências do efeito

  return null; // Este componente não renderiza nada visualmente
}

interface MapComponentProps {
  countriesData: FeatureCollection;
  statesData: FeatureCollection;
  selectedCountry: Feature | null;
  setSelectedCountry: (country: Feature) => void; 
  setAnalysisData: (data: AnalysisData) => void;
}

const MapComponent = ({ 
  countriesData, 
  statesData, 
  selectedCountry, 
  setSelectedCountry,
  setAnalysisData
}: MapComponentProps) => {

  const onEachCountry = useCallback((country: Feature, layer: Layer) => {
    layer.on({
      click: () => {
        // Agora o clique no país SÓ atualiza o estado
        setSelectedCountry(country);
      }
    });
  }, [setSelectedCountry]);

  const onEachState = useCallback((state: Feature, layer: Layer) => {
    const stateName = state.properties?.Estado;
    layer.on({
      click: () => {
        // O clique no estado SÓ busca os dados
        setAnalysisData({ name: stateName, ndvi: [], plants: [] });
      }
    });
  }, [setAnalysisData]);

  return (
    <MapContainer 
      center={[20, 0]}
      zoom={2} 
      style={{ height: '100vh', width: '100%' }}
      worldCopyJump={false}
      maxBounds={[[-90, -180], [90, 180]]}
      maxBoundsViscosity={1.0}
    >
   <TileLayer
    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  />
      
      <GeoJSON 
        data={countriesData}
        onEachFeature={onEachCountry}
        style={() => ({
          color: '#ffffff', weight: 0.5, fillColor: '#ffffff', fillOpacity: 0.05
        })}
      />

      {selectedCountry && selectedCountry.properties?.name === 'Brazil' && (
        <GeoJSON 
          data={statesData}
          onEachFeature={onEachState}
          style={() => ({
            color: '#fbbf24', weight: 1, fillColor: '#fbbf24', fillOpacity: 0.2
          })}
        />
      )}
      
      {/* Adicionamos nosso novo componente de eventos aqui */}
      <MapEvents selectedCountry={selectedCountry} />
    </MapContainer>
  );
};

export default MapComponent;