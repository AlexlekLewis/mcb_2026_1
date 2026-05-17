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
  forms: { label: "Form Starts", color: "#1d4ed8", description: "Where visitors began filling the quote form" },
};

const MELBOURNE_CENTER: [number, number] = [-37.81, 144.96];
const DEFAULT_ZOOM = 10;

const ALL_LAYER_KEYS = Object.keys(LAYER_META) as LayerKey[];

export function MelbourneMap({ data }: { data: MelbourneMapData }) {
  // Multi-select: any subset of metrics can render simultaneously as colored
  // overlays. Default to just "leads" so the panel opens with the most signal-
  // rich layer alone, matching the prior single-select default.
  const [activeLayers, setActiveLayers] = useState<Set<LayerKey>>(() => new Set(["leads"]));
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const heatRefs = useRef<Map<LayerKey, L.Layer>>(new Map());
  const markersRefs = useRef<Map<LayerKey, L.LayerGroup>>(new Map());

  const totals = useMemo(() => {
    const result: Record<LayerKey, number> = {
      views: 0,
      visitors: 0,
      leads: 0,
      phone: 0,
      forms: 0,
    };
    ALL_LAYER_KEYS.forEach((key) => {
      result[key] = data[key].reduce((sum, point) => sum + point.count, 0);
    });
    return result;
  }, [data]);

  const totalActivePoints = useMemo(
    () => ALL_LAYER_KEYS.reduce((sum, key) => (activeLayers.has(key) ? sum + data[key].length : sum), 0),
    [data, activeLayers]
  );

  const toggleLayer = (key: LayerKey) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const allActive = activeLayers.size === ALL_LAYER_KEYS.length;
  const toggleAll = () => {
    setActiveLayers(allActive ? new Set() : new Set(ALL_LAYER_KEYS));
  };

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

    mapRef.current = map;
    // Snapshot for cleanup — eslint can't tell that .current is always the
    // live ref bag, and we genuinely want the current contents at unmount.
    const heatBag = heatRefs.current;
    const markersBag = markersRefs.current;

    return () => {
      map.remove();
      mapRef.current = null;
      heatBag.clear();
      markersBag.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Strip every existing layer; we rebuild from scratch each render so the
    // layer set always reflects activeLayers exactly.
    heatRefs.current.forEach((layer) => map.removeLayer(layer));
    heatRefs.current.clear();
    markersRefs.current.forEach((group) => {
      group.clearLayers();
      map.removeLayer(group);
    });
    markersRefs.current.clear();

    const boundsPoints: Array<[number, number]> = [];

    for (const key of ALL_LAYER_KEYS) {
      if (!activeLayers.has(key)) continue;
      const points = data[key];
      if (points.length === 0) continue;
      const color = LAYER_META[key].color;
      const maxCount = points.reduce((max, point) => Math.max(max, point.count), 1);

      const heatPoints: L.HeatLatLngTuple[] = points.map((point) => [
        point.lat,
        point.lng,
        Math.max(point.count / maxCount, 0.15),
      ]);
      const heatLayer = L.heatLayer(heatPoints, {
        radius: 26,
        blur: 20,
        maxZoom: 14,
        minOpacity: 0.3,
        gradient: {
          0.2: `${color}33`,
          0.5: `${color}99`,
          0.8: color,
          1.0: color,
        },
      });
      heatLayer.addTo(map);
      heatRefs.current.set(key, heatLayer);

      const markerGroup = L.layerGroup().addTo(map);
      points.forEach((point) => {
        const radius = 4 + (point.count / maxCount) * 9;
        const marker = L.circleMarker([point.lat, point.lng], {
          radius,
          color,
          weight: 1.5,
          fillColor: color,
          fillOpacity: 0.5,
        });
        const labelText = point.label ? `<strong>${escapeHtml(point.label)}</strong><br/>` : "";
        marker.bindTooltip(
          `${labelText}${point.count.toLocaleString()} ${LAYER_META[key].label.toLowerCase()}`,
          { direction: "top", offset: [0, -4] }
        );
        marker.addTo(markerGroup);
        boundsPoints.push([point.lat, point.lng]);
      });
      markersRefs.current.set(key, markerGroup);
    }

    if (boundsPoints.length > 0) {
      const bounds = L.latLngBounds(boundsPoints);
      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.2), { maxZoom: 12, animate: false });
      }
    }
  }, [data, activeLayers]);

  const hasAnyActive = activeLayers.size > 0;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={toggleAll}
          className={`flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
            allActive
              ? "border-mcb-charcoal bg-mcb-charcoal text-white"
              : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
          }`}
          aria-pressed={allActive}
        >
          {allActive ? "Clear all" : "Show all"}
        </button>
        {ALL_LAYER_KEYS.map((key) => {
          const meta = LAYER_META[key];
          const isActive = activeLayers.has(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleLayer(key)}
              aria-pressed={isActive}
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
        {!hasAnyActive ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/70 text-sm text-stone-500">
            Pick one or more metrics above to see them on the map.
          </div>
        ) : totalActivePoints === 0 ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/70 text-sm text-stone-500">
            No location data for the selected metrics in the last 30 days.
          </div>
        ) : null}
      </div>

      <p className="mt-3 text-xs text-stone-500">
        Toggle any metric on or off — multiple layers overlay with their own color. Locations come from
        visitor IP geolocation; leads use their typed suburb.
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
