"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouteStops } from "@/contexts/RouteContext";
import { useTranslation } from "@/contexts/LanguageContext";
import { Calendar, Clock } from "lucide-react";

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export function MapWithRoute() {
  const { stops: routeStops, selectedStopId } = useRouteStops();
  const { locale } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (mapRef.current && selectedStopId && markersRef.current[selectedStopId]) {
      const marker = markersRef.current[selectedStopId];
      mapRef.current.flyTo(marker.getLatLng(), 15);
      marker.openPopup();
    }
  }, [selectedStopId]);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markersRef.current = {};
    }

    const map = L.map(mapContainerRef.current, { zoomControl: true }).setView(
      [31.2001, 29.9187],
      13
    );

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }
    ).addTo(map);

    mapRef.current = map;

    const sortedStops = [...routeStops].sort((a, b) => a.order - b.order);

    if (sortedStops.length > 0) {
      const positions: [number, number][] = sortedStops.map((s) => [s.lat, s.lng]);

      sortedStops.forEach((stop, index) => {
        const name = locale === "ar" ? stop.name_ar : stop.name_en;
        const description = locale === "ar" ? stop.description_ar : stop.description_en;
        const date = locale === "ar" ? stop.date_ar : stop.date_en;
        const time = locale === "ar" ? stop.time_ar : stop.time_en;

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            background:#f97316;
            color:#fff;
            width:32px;
            height:32px;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            display:flex;
            align-items:center;
            justify-content:center;
            font-weight:700;
            font-size:13px;
            box-shadow:0 2px 8px rgba(0,0,0,0.25);
            border:2px solid #fff;
          "><span style="transform:rotate(45deg)">${index + 1}</span></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -36],
        });

        const marker = L.marker([stop.lat, stop.lng], { icon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family:system-ui,sans-serif;min-width:200px;padding:4px">
            <strong style="font-size:16px;color:#1e293b">${name}</strong>
            <div style="margin-top:8px;display:flex;flex-direction:column;gap:4px">
              <div style="display:flex;items-center;gap:6px;font-size:12px;color:#f97316;font-weight:700">
                <span>📅</span> ${date || '---'}
              </div>
              <div style="display:flex;items-center;gap:6px;font-size:12px;color:#64748b">
                <span>⏰</span> ${time || '---'}
              </div>
            </div>
            <p style="margin:8px 0 0;font-size:13px;color:#475569;line-height:1.5">${description}</p>
          </div>
        `);
        
        markersRef.current[stop.id] = marker;
      });

      if (positions.length > 1) {
        L.polyline(positions, {
          color: "#f97316",
          weight: 4,
          opacity: 0.6,
          dashArray: "10, 10",
        }).addTo(map);
      }

      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isClient, routeStops, locale]);

  return (
    <div
      ref={mapContainerRef}
      className="h-full w-full"
      style={{ zIndex: 0 }}
    />
  );
}