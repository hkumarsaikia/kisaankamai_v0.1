"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  sublabel?: string;
  color?: string;
}

interface MapCircle {
  lat: number;
  lng: number;
  radius: number;
  color?: string;
}

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  circles?: MapCircle[];
  height?: string;
  className?: string;
  showControls?: boolean;
}

export default function MapComponent({
  center = [16.85, 74.55],
  zoom = 10,
  markers = [],
  circles = [],
  height = "500px",
  className = "",
  showControls = true,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current) return;

    // Dynamically import leaflet only on client
    import("leaflet").then((L) => {
      // Fix default marker icon issue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      // Destroy previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapRef.current!, {
        center: center,
        zoom: zoom,
        zoomControl: showControls,
        attributionControl: true,
        scrollWheelZoom: false,
      });

      // Use dark-themed tile layer for dark mode
      const isDark = resolvedTheme === "dark";
      const tileUrl = isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

      L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/legal">CARTO</a>',
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);

      // Add markers with custom styled popups
      markers.forEach((m) => {
        const markerColor = m.color || "#934a24";
        const customIcon = L.divIcon({
          className: "custom-map-marker",
          html: `
            <div style="
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
            ">
              <div style="
                background: ${markerColor};
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                font-family: 'Manrope', sans-serif;
                white-space: nowrap;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                margin-bottom: 4px;
                letter-spacing: 0.5px;
              ">${m.label}</div>
              <div style="
                width: 14px;
                height: 14px;
                background: ${markerColor};
                border-radius: 50%;
                box-shadow: 0 0 0 4px ${markerColor}33, 0 0 0 8px ${markerColor}15;
                animation: pulse 2s infinite;
              "></div>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 20],
        });

        const marker = L.marker([m.lat, m.lng], { icon: customIcon }).addTo(map);

        if (m.sublabel) {
          marker.bindPopup(
            `<div style="font-family: 'Manrope', sans-serif; padding: 4px 0;">
              <strong style="color: #00251a; font-size: 14px;">${m.label}</strong>
              <p style="color: #414844; font-size: 12px; margin: 4px 0 0 0;">${m.sublabel}</p>
            </div>`,
            { className: "kisan-popup" }
          );
        }
      });

      // Add Coverage Circles
      circles.forEach((c) => {
        const circleColor = c.color || "#047857"; // emerald-700
        L.circle([c.lat, c.lng], {
          color: circleColor,
          fillColor: circleColor,
          fillOpacity: 0.15,
          weight: 2,
          radius: c.radius,
        }).addTo(map);
      });

      // Fit bounds if multiple markers or circles

      if (markers.length > 1) {
        const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      mapInstanceRef.current = map;

      // Fix rendering after mount
      setTimeout(() => map.invalidateSize(), 100);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, resolvedTheme]);

  if (!mounted) {
    return (
      <div
        className={`animate-pulse bg-surface-container dark:bg-emerald-900/30 rounded-2xl ${className}`}
        style={{ height }}
      />
    );
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <style>{`
        .custom-map-marker { background: transparent !important; border: none !important; }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(147, 74, 36, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(147, 74, 36, 0); }
          100% { box-shadow: 0 0 0 0 rgba(147, 74, 36, 0); }
        }
        .kisan-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }
        .kisan-popup .leaflet-popup-tip {
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .leaflet-control-attribution {
          font-size: 9px !important;
          opacity: 0.6;
        }
      `}</style>
      <div
        ref={mapRef}
        className={`rounded-2xl overflow-hidden ${className}`}
        style={{ height, width: "100%" }}
      />
    </>
  );
}
