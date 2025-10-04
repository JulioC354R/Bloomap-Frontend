"use client";

import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapClickHandler = () => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      alert(`Você clicou em:\nLatitude: ${lat}\nLongitude: ${lng}`);
    },
  });
  return null;
};

const MapComponent = () => {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <MapClickHandler />
    </MapContainer>
  );
};

export default MapComponent;
