// antes
// import MapClient from "@/components/map/MapClient";

import MapLoader from "@/components/map/MapLoader";

export default function Page() {
  return (
    <main className="h-screen w-screen">
      <MapLoader duration={3000} />
    </main>
  );
}
