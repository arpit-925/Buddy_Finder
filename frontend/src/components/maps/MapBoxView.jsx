import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapBoxView = ({
  lat,
  lng,
  markers = [],
  mode = "view",
  onSelect,
}) => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const singleMarker = useRef(null);

  const latNum = Number(lat);
  const lngNum = Number(lng);

  /* =========================
     INIT MAP
  ========================= */
  useEffect(() => {
    if (!mapRef.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lngNum || 77.209, latNum || 28.6139],
      zoom: latNum && lngNum ? 9 : 4,
    });

    return () => map.current?.remove();
  }, []);

  /* =========================
     SINGLE MARKER + FLY
  ========================= */
  useEffect(() => {
    if (!map.current || isNaN(latNum) || isNaN(lngNum)) return;

    // remove old marker
    singleMarker.current?.remove();

    // add marker
    singleMarker.current = new mapboxgl.Marker()
      .setLngLat([lngNum, latNum])
      .addTo(map.current);

    // move map to location
    map.current.flyTo({
      center: [lngNum, latNum],
      zoom: 10,
      essential: true,
    });

    if (mode === "edit") {
      const clickHandler = async (e) => {
        const { lng, lat } = e.lngLat;
        singleMarker.current.setLngLat([lng, lat]);

        try {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
          );
          const data = await res.json();

          onSelect?.({
            lat,
            lng,
            address: data.features?.[0]?.place_name || "",
          });
        } catch (err) {
          console.error("Reverse geocode failed", err);
        }
      };

      map.current.on("click", clickHandler);
      return () => map.current.off("click", clickHandler);
    }
  }, [latNum, lngNum, mode, onSelect]);

  return (
    <div
      ref={mapRef}
      className="w-full h-64 rounded-xl overflow-hidden"
    />
  );
};

export default MapBoxView;
