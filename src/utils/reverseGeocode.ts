export async function reverseGeocode(lat: number, lon: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Bloomap/1.0 (julio@teste.com)" }, // Nominatim exige um user-agent
  });

  if (!res.ok) throw new Error("Falha ao buscar localização");

  const data = await res.json();
  const addr = data.address || {};

  return {
    country: addr.country || null,
    state: addr.state || addr.region || null,
    city: addr.city || addr.town || addr.village || addr.municipality || null,
  };
}
