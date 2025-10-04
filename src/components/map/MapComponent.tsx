"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import RadiusSlider from "./RadiusSlider";

import { useMapEvents, Circle } from "react-leaflet";
import { useState } from "react";

interface MapClickHandlerProps {
  radius: number;
}

const MapClickHandler = ({ radius }: MapClickHandlerProps) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [bbox, setBbox] = useState<number[] | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });

      // calcula delta de latitude e longitude aproximado
      const earthRadius = 6378137; // em metros
      const latDelta = (radius / earthRadius) * (180 / Math.PI);
      const lngDelta =
        ((radius / earthRadius) * (180 / Math.PI)) /
        Math.cos((lat * Math.PI) / 180);

      const bboxArray = [
        lng - lngDelta, // minLng
        lat - latDelta, // minLat
        lng + lngDelta, // maxLng
        lat + latDelta, // maxLat
      ];

      setBbox(bboxArray);
      console.log("BBox:", bboxArray);
    },
  });

  return (
    <>
      {position && (
        <Circle
          center={[position.lat, position.lng]}
          radius={radius}
          pathOptions={{
            color: "#2E96F5",
            fillColor: "#2E96F5",
            fillOpacity: 0.3,
          }}
        />
      )}

      {bbox && (
        <pre
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "#fff",
            padding: "5px",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          {JSON.stringify(bbox, null, 2)}
        </pre>
      )}
    </>
  );
};

const MapComponent = () => {
  const [radius, setRadius] = useState(5000); // valor inicial do raio

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
      />
      <MapClickHandler radius={radius} />
      <RadiusSlider radius={radius} setRadius={setRadius} />
    </MapContainer>
  );
};

export default MapComponent;
