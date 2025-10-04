// src/app/page.tsx
import fs from 'fs';
import path from 'path';
import { FeatureCollection } from 'geojson';
import MapLoader from '@/components/map/MapLoader';

export default function Home() {
  // 1. Ler os dados dos PAÍSES no servidor
  const countriesPath = path.join(process.cwd(), 'src', 'data', 'countries.geojson');
  const countriesFile = fs.readFileSync(countriesPath, 'utf8');
  const countriesData: FeatureCollection = JSON.parse(countriesFile);

  // 2. Ler os dados dos ESTADOS DO BRASIL no servidor
  const statesPath = path.join(process.cwd(), 'src', 'data', 'brazil-states.geojson');
  const statesFile = fs.readFileSync(statesPath, 'utf8');
  const statesData: FeatureCollection = JSON.parse(statesFile);

  // 3. Renderizar o MapLoader, passando AMBOS os dados
  return (
    <main>
      <MapLoader countriesData={countriesData} statesData={statesData} />
    </main>
  );
}