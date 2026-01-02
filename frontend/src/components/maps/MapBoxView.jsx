import { useEffect, useRef } from "react";
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
     DESTINATION MARKER + POPUP
  ========================= */
  useEffect(() => {
    if (!map.current || isNaN(latNum) || isNaN(lngNum)) return;

    // remove old marker & popup
    markerRef.current?.remove();
    popupRef.current?.remove();

    // visible marker
    const el = document.createElement("div");
    el.innerHTML = "📍";
    el.style.fontSize = "28px";

    markerRef.current = new mapboxgl.Marker(el)
      .setLngLat([lngNum, latNum])
      .addTo(map.current);

    // 🔥 DYNAMIC POPUP (KEY FIX)
    popupRef.current = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
    })
      .setLngLat([lngNum, latNum])
      .setHTML(
        `<strong>${address || "Trip Destination"}</strong>`
      )
      .addTo(map.current);

    // center map
    map.current.flyTo({
      center: [lngNum, latNum],
      zoom: 10,
      speed: 1.2,
      essential: true,
    });

    /* =========================
       CLICK TO SELECT (EDIT MODE)
    ========================= */
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

          const place =
            data.features?.[0]?.place_name || "";

          popupRef.current.setHTML(
            `<strong>${place}</strong>`
          );

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
      return () =>
        map.current.off("click", clickHandler);
    }
  }, [latNum, lngNum, address, mode, onSelect]);

  return (
    <div
      ref={mapRef}
      className="w-full h-64 rounded-xl overflow-hidden"
    />
  );
};

export default MapBoxView;
