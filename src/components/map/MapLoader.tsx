"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import SplashScreen from "../SplashScreen/SplashScreen";

// Carrega o MapComponent somente no cliente
const Map = dynamic(() => import("./MapComponent"), { ssr: false });

interface MapLoaderProps {
  duration?: number;
}

const MapLoader = ({ duration = 2500 }: MapLoaderProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <>
      {loading && <SplashScreen duration={duration} />}
      {!loading && <Map />}
    </>
  );
};

export default MapLoader;
