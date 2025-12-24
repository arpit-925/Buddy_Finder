import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapBoxView = ({
  lat,
  lng,
  markers = [],
  mode = "view", // "view" | "edit"
  onSelect,
}) => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const singleMarker = useRef(null);
  const markersRef = useRef([]);
  const popupRef = useRef(null);
  const [popupData, setPopupData] = useState(null);

  /* =========================
     INIT MAP (ONLY ONCE)
  ========================= */
  useEffect(() => {
    if (!mapRef.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng ?? 77.209, lat ?? 28.6139],
      zoom: lat && lng ? 9 : 4,
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  /* =========================
     SINGLE MARKER (VIEW / EDIT)
  ========================= */
  useEffect(() => {
    if (!map.current || !lat || !lng) return;

    singleMarker.current?.remove();

    singleMarker.current = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map.current);

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
      return () => map.current?.off("click", clickHandler);
    }
  }, [lat, lng, mode, onSelect]);

  /* =========================
     MULTIPLE MARKERS
  ========================= */
  useEffect(() => {
    if (!map.current || !markers.length) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    markers.forEach((m) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([m.lng, m.lat])
        .addTo(map.current);

      marker.getElement().addEventListener("click", () => {
        setPopupData(m);
      });

      markersRef.current.push(marker);
    });
  }, [markers]);

  /* =========================
     POPUP
  ========================= */
  useEffect(() => {
    if (!popupData || !map.current) return;

    popupRef.current?.remove();

    popupRef.current = new mapboxgl.Popup({ offset: 25 })
      .setLngLat([popupData.lng, popupData.lat])
      .setHTML(popupData.popup)
      .addTo(map.current);

    return () => popupRef.current?.remove();
  }, [popupData]);

  return (
    <div
      ref={mapRef}
      className="w-full h-64 rounded-xl overflow-hidden"
    />
  );
};

export default MapBoxView;
