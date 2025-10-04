"use client";
import Map from "./MapComponent";
import { useState, useEffect } from "react";
import SplashScreen from "../SplashScreen/SplashScreen";
const MapLoader = () => {
  const [loading, setLoading] = useState(true);

  // Simula um tempo de carregamento (pode remover depois se quiser)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <SplashScreen duration={2500} />}
      {!loading && <Map />}
    </>
  );
};

export default MapLoader;
