import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { LocateFixed, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type LatLng = { lat: number; lng: number };

const BLR_CENTER: LatLng = { lat: 12.9716, lng: 77.5946 };

export function PickupMap({
  value,
  onChange,
  className,
}: {
  value: LatLng | null;
  onChange: (v: LatLng) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [locating, setLocating] = useState(false);
  const [ready, setReady] = useState(false);

  // Init map (client only)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const start = value ?? BLR_CENTER;
      const map = L.map(containerRef.current, {
        center: [start.lat, start.lng],
        zoom: value ? 16 : 12,
        zoomControl: true,
        attributionControl: false,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const pin = L.divIcon({
        className: "",
        html: `<div style="transform:translate(-50%,-100%)"><svg width="34" height="34" viewBox="0 0 24 24" fill="hsl(160 84% 39%)" stroke="white" stroke-width="1.5"><path d="M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11z"/><circle cx="12" cy="10" r="2.5" fill="white" stroke="none"/></svg></div>`,
        iconSize: [34, 34],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([start.lat, start.lng], {
        icon: pin,
        draggable: true,
      }).addTo(map);

      marker.on("dragend", () => {
        const p = marker.getLatLng();
        onChangeRef.current({ lat: p.lat, lng: p.lng });
      });
      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        marker.setLatLng(e.latlng);
        onChangeRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      mapRef.current = map;
      markerRef.current = marker;
      setReady(true);
      setTimeout(() => map.invalidateSize(), 200);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep marker in sync when value changes externally (e.g. geolocation)
  useEffect(() => {
    if (!ready || !value || !mapRef.current || !markerRef.current) return;
    markerRef.current.setLatLng([value.lat, value.lng]);
    mapRef.current.setView([value.lat, value.lng], 16);
  }, [value, ready]);

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Location isn't supported on this device.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success("Pinned your current location.");
      },
      () => {
        setLocating(false);
        toast.error("Couldn't get your location. You can drag the pin instead.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card", className)}>
      <div className="relative">
        <div ref={containerRef} className="h-48 w-full" />
        <button
          type="button"
          onClick={useMyLocation}
          className="absolute right-3 top-3 z-[400] inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-soft backdrop-blur transition-colors hover:bg-background"
        >
          {locating ? <Loader2 className="size-3.5 animate-spin" /> : <LocateFixed className="size-3.5 text-primary" />}
          Use my location
        </button>
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-muted-foreground">
        <span>Tap the map or drag the pin to set your exact spot.</span>
        {value && (
          <span className="shrink-0 font-medium text-foreground">
            {value.lat.toFixed(4)}, {value.lng.toFixed(4)}
          </span>
        )}
      </div>
    </div>
  );
}
