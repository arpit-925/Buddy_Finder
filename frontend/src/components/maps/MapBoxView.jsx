import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapBoxView = ({
  lat,
  lng,
  address,
  markers = [],
  mode = "view",
  onSelect,
}) => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const popupRef = useRef(null);
  const [ready, setReady] = useState(false);

  const latNum = Number(lat);
  const lngNum = Number(lng);
  const hasCoords =
    !isNaN(latNum) && !isNaN(lngNum) && latNum !== 0 && lngNum !== 0;

  useEffect(() => {
    if (!mapRef.current || map.current) return;

    const initialCenter = hasCoords ? [lngNum, latNum] : [77.209, 28.6139];
    const initialZoom = hasCoords ? 13 : 4;

    map.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: initialCenter,
      zoom: initialZoom,
    });

    map.current.on("load", () => setReady(true));

    return () => {
      map.current?.remove();
      map.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    if (!map.current || !ready || !hasCoords) return;

    markerRef.current?.remove();
    popupRef.current?.remove();

    const el = document.createElement("div");
    el.innerHTML = "📍";
    el.style.fontSize = "28px";
    el.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))";

    markerRef.current = new mapboxgl.Marker(el)
      .setLngLat([lngNum, latNum])
      .addTo(map.current);

    popupRef.current = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
    })
      .setLngLat([lngNum, latNum])
      .setHTML(`<strong>${address || "Trip Destination"}</strong>`)
      .addTo(map.current);

    map.current.flyTo({
      center: [lngNum, latNum],
      zoom: 13,
      speed: 0.8,
      essential: true,
    });

    if (mode === "edit") {
      const clickHandler = async (e) => {
        const { lng, lat } = e.lngLat;

        markerRef.current.setLngLat([lng, lat]);
        popupRef.current.setLngLat([lng, lat]);

        try {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
          );
          const data = await res.json();
          const place = data.features?.[0]?.place_name || "";

          popupRef.current.setHTML(`<strong>${place}</strong>`);

          onSelect?.({
            lat,
            lng,
            address: place,
          });
        } catch (err) {
          console.error("Reverse geocode failed", err);
        }
      };

      map.current.on("click", clickHandler);
      return () => map.current?.off("click", clickHandler);
    }
  }, [ready, hasCoords, latNum, lngNum, address, mode, onSelect]);

  return (
    <div
      ref={mapRef}
      className="w-full h-64 rounded-xl overflow-hidden"
    />
  );
};

export default MapBoxView;
