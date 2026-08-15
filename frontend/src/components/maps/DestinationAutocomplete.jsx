import { useEffect, useRef, useState } from "react";
import { FiMapPin } from "react-icons/fi";

const token = import.meta.env.VITE_MAPBOX_TOKEN;

export default function DestinationAutocomplete({ value, onChange, onSelect, placeholder = "Search a destination..." }) {
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState(-1);
  const root = useRef(null);
  const request = useRef(null);

  useEffect(() => {
    const close = (event) => { if (!root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (value.trim().length < 2) { setResults([]); setOpen(false); setLoading(false); return; }
    if (!token) { setError("Destination search is unavailable. Configure VITE_MAPBOX_TOKEN."); setOpen(true); return; }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true); setError("");
        const query = encodeURIComponent(value.trim());
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&autocomplete=true&types=place,locality,neighborhood,address&limit=6`, { signal: controller.signal });
        if (!response.ok) throw new Error("Geocoding request failed");
        const data = await response.json();
        setResults(data.features || []); setOpen(true); setActive(-1);
      } catch (err) {
        if (err.name !== "AbortError") { setError("Unable to find destinations right now. Please try again."); setOpen(true); }
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, 350);
    request.current = controller;
    return () => { clearTimeout(timer); controller.abort(); };
  }, [value]);

  const select = (place) => {
    const [lng, lat] = place.center;
    onChange(place.place_name);
    onSelect({ lat, lng, address: place.place_name });
    setOpen(false); setResults([]);
  };
  const onKeyDown = (event) => {
    if (event.key === "Escape") return setOpen(false);
    if (!results.length) return;
    if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); setActive((i) => Math.min(i + 1, results.length - 1)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    if (event.key === "Enter" && active >= 0) { event.preventDefault(); select(results[active]); }
  };
  return <div ref={root} className="relative min-w-0">
    <input value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => results.length && setOpen(true)} onKeyDown={onKeyDown} className="input h-12 min-w-0 px-4 py-0 leading-normal" placeholder={placeholder} role="combobox" aria-expanded={open} aria-controls="destination-options" aria-autocomplete="list" />
    {open && <div id="destination-options" role="listbox" className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-slate-200">
      {loading && <p className="px-4 py-3 text-sm text-muted">Searching destinations...</p>}
      {!loading && error && <p className="px-4 py-3 text-sm text-red-600">{error}</p>}
      {!loading && !error && !results.length && <p className="px-4 py-3 text-sm text-muted">No destinations found</p>}
      {!loading && results.map((place, index) => <button key={place.id} type="button" role="option" aria-selected={index === active} onMouseDown={() => select(place)} className={`flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 ${index === active ? "bg-blue-50" : ""}`}><FiMapPin className="mt-0.5 shrink-0 text-teal" /><span><span className="block text-sm font-semibold text-ink">{place.text}</span><span className="block text-xs text-muted">{place.place_name.replace(`${place.text}, `, "")}</span></span></button>)}
    </div>}
  </div>;
}
