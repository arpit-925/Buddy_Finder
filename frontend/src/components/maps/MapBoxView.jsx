import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

const token = import.meta.env.VITE_MAPBOX_TOKEN;
const valid = (lat, lng) => Number.isFinite(Number(lat)) && Number.isFinite(Number(lng)) && Math.abs(Number(lat)) <= 90 && Math.abs(Number(lng)) <= 180;

export default function MapBoxView({ lat, lng, markers = [], mode = "view", onSelect }) {
  const container = useRef(null); const map = useRef(null); const selectedMarker = useRef(null); const extraMarkers = useRef([]); const onSelectRef = useRef(onSelect); const initial = useRef(valid(lat, lng) ? [Number(lng), Number(lat)] : [77.209, 28.6139]); const [error, setError] = useState("");
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  useEffect(() => {
    if (!token) return;
    if (!container.current || map.current) return;
    mapboxgl.accessToken = token;
    const instance = new mapboxgl.Map({ container: container.current, style: "mapbox://styles/mapbox/streets-v12", center: initial.current, zoom: valid(lat, lng) ? 12 : 4 });
    instance.addControl(new mapboxgl.NavigationControl(), "top-right");
    instance.on("error", (event) => { if (event.error?.status === 401 || event.error?.status === 403) setError("Unable to load the map. Please check the Mapbox token."); });
    if (mode === "edit") instance.on("click", async (event) => {
      const { lat: pickedLat, lng: pickedLng } = event.lngLat;
      let pickedAddress = "Selected map location";
      try { const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${pickedLng},${pickedLat}.json?access_token=${token}`); const data = await response.json(); pickedAddress = data.features?.[0]?.place_name || pickedAddress; } catch { /* coordinates still remain usable */ }
      onSelectRef.current?.({ lat: pickedLat, lng: pickedLng, address: pickedAddress });
    });
    map.current = instance;
    return () => { extraMarkers.current.forEach((item) => item.remove()); map.current?.remove(); map.current = null; };
  }, [mode]);
  useEffect(() => {
    if (!map.current || !valid(lat, lng)) return;
    const coordinates = [Number(lng), Number(lat)];
    if (!selectedMarker.current) selectedMarker.current = new mapboxgl.Marker({ color: "#2563EB" });
    selectedMarker.current.setLngLat(coordinates);
    if (!selectedMarker.current._map) selectedMarker.current.addTo(map.current);
    map.current.flyTo({ center: coordinates, zoom: 13, essential: true });
  }, [lat, lng]);
  useEffect(() => {
    if (!map.current) return;
    extraMarkers.current.forEach((item) => item.remove());
    extraMarkers.current = markers
      .filter((item) => item && valid(item.lat, item.lng))
      .map((item) => new mapboxgl.Marker({ color: "#0D9488" }).setLngLat([Number(item.lng), Number(item.lat)]).setPopup(new mapboxgl.Popup({ offset: 18 }).setText(item.address || item.destination || "Trip location")).addTo(map.current));
  }, [markers]);
  if (!token || error) return <div className="flex h-64 items-center justify-center rounded-2xl bg-slate-100 p-6 text-center text-sm text-muted">{error || "Unable to load the map. Configure VITE_MAPBOX_TOKEN and restart Vite."}</div>;
  return <div className="relative"><div ref={container} className="h-80 w-full overflow-hidden rounded-2xl sm:h-96 lg:h-[500px]" aria-label="Interactive map" />{mode === "edit" && <p className="mt-2 text-xs text-muted">Search for a destination or click the map to set the location.</p>}</div>;
}
