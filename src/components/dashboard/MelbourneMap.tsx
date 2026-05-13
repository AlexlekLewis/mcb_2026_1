"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet.heat";

export type MapPoint = {
  lat: number;
  lng: number;
  count: number;
  label?: string | null;
};

export type MelbourneMapData = {
  views: MapPoint[];
  visitors: MapPoint[];
  leads: MapPoint[];
  phone: MapPoint[];
  forms: MapPoint[];
};

type LayerKey = keyof MelbourneMapData;

const LAYER_META: Record<LayerKey, { label: string; color: string; description: string }> = {
  views: { label: "Page Views", color: "#b85a3e", description: "All page view events" },
  visitors: { label: "Visitors", color: "#0f766e", description: "Unique visitors by location" },
  leads: { label: "Leads", color: "#9333ea", description: "Lead submissions (by suburb)" },
  phone: { label: "Phone Taps", color: "#ea580c", description: "Click-to-call interactions" },
  forms: { label: "Form Submits", color: "#1d4ed8", description: "Quote form submissions" },
};

const MELBOURNE_CENTER: [number, number] = [-37.81, 144.96];
const DEFAULT_ZOOM = 10;

export function MelbourneMap({ data }: { data: MelbourneMapData }) {
  const [active, setActive] = useState<LayerKey>("leads");
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const heatRef = useRef<L.Layer | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const points = data[active];

  const totals = useMemo(() => {
    const totals: Record<LayerKey, number> = {
      views: 0,
      visitors: 0,
      leads: 0,
      phone: 0,
      forms: 0,
    };
    (Object.keys(LAYER_META) as LayerKey[]).forEach((key) => {
      totals[key] = data[key].reduce((sum, point) => sum + point.count, 0);
    });
    return totals;
  }, [data]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: MELBOURNE_CENTER,
      zoom: DEFAULT_ZOOM,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
      heatRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const markers = markersRef.current;
    if (!map || !markers) return;

    if (heatRef.current) {
      map.removeLayer(heatRef.current);
      heatRef.current = null;
    }
    markers.clearLayers();

    if (points.length === 0) return;

    const maxCount = points.reduce((max, point) => Math.max(max, point.count), 1);
    const color = LAYER_META[active].color;

    const heatPoints: L.HeatLatLngTuple[] = points.map((point) => [
      point.lat,
      point.lng,
      Math.max(point.count / maxCount, 0.15),
    ]);

    const heatLayer = L.heatLayer(heatPoints, {
      radius: 30,
      blur: 22,
      maxZoom: 14,
      minOpacity: 0.35,
      gradient: {
        0.2: `${color}33`,
        0.5: `${color}99`,
        0.8: color,
        1.0: color,
      },
    });
    heatLayer.addTo(map);
    heatRef.current = heatLayer;

    points.forEach((point) => {
      const radius = 4 + (point.count / maxCount) * 10;
      const marker = L.circleMarker([point.lat, point.lng], {
        radius,
        color,
        weight: 1.5,
        fillColor: color,
        fillOpacity: 0.55,
      });
      const labelText = point.label ? `<strong>${escapeHtml(point.label)}</strong><br/>` : "";
      marker.bindTooltip(`${labelText}${point.count.toLocaleString()} ${LAYER_META[active].label.toLowerCase()}`, {
        direction: "top",
        offset: [0, -4],
      });
      marker.addTo(markers);
    });

    const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng] as [number, number]));
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.2), { maxZoom: 12, animate: false });
    }
  }, [points, active]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {(Object.keys(LAYER_META) as LayerKey[]).map((key) => {
          const meta = LAYER_META[key];
          const isActive = key === active;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                isActive
                  ? "border-transparent text-white shadow-sm"
                  : "border-stone-300 bg-white text-stone-600 hover:bg-stone-50"
              }`}
              style={isActive ? { backgroundColor: meta.color } : undefined}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              {meta.label}
              <span className={isActive ? "text-white/80" : "text-stone-400"}>
                {totals[key].toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-sm border border-stone-300">
        <div ref={mapContainerRef} style={{ width: "100%", height: 460 }} />
        {points.length === 0 ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/70 text-sm text-stone-500">
            No {LAYER_META[active].label.toLowerCase()} with location data in the last 30 days.
          </div>
        ) : null}
      </div>

      <p className="mt-3 text-xs text-stone-500">
        {LAYER_META[active].description}. Locations come from visitor IP geolocation; leads use their typed suburb.
      </p>
    </div>
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
