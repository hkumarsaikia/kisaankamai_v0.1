"use client";

import { useState, useCallback, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker, Circle, InfoWindow } from "@react-google-maps/api";

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
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", 
    // We pass an empty string if undefined. Google maps standard behavior is to show "For development purposes only" if not provided/invalid.
  });

  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  const centerObj = useMemo(() => ({ lat: center[0], lng: center[1] }), [center]);

  const onLoad = useCallback(function callback(mapInstance: google.maps.Map) {
    if (markers.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach(m => bounds.extend({ lat: m.lat, lng: m.lng }));
      mapInstance.fitBounds(bounds);
      mapInstance.panToBounds(bounds);
    }
  }, [markers]);

  const onUnmount = useCallback(function callback() {
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === "") {
    const fallbackUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center[1]-0.1},${center[0]-0.1},${center[1]+0.1},${center[0]+0.1}&layer=mapnik&marker=${center[0]},${center[1]}`;
    return (
      <div className={`overflow-hidden rounded-3xl shadow-xl dark:border-slate-800 ${className}`} style={{ height, width: "100%", border: '1px solid #e2e8f0' }}>
        <iframe 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          scrolling="no" 
          src={fallbackUrl}
          style={{ border: 0 }}
        ></iframe>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`animate-pulse bg-slate-100 dark:bg-slate-900/50 rounded-2xl ${className}`}
        style={{ height }}
      />
    );
  }

  return (
    <div className={`overflow-hidden ${className}`} style={{ height, width: "100%" }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={centerObj}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControl: showControls,
          zoomControl: showControls,
          streetViewControl: false,
          fullscreenControl: showControls,
          mapTypeId: 'terrain' // Default to terrain/hybrid
        }}
      >
        {circles.map((c, idx) => (
          <Circle
            key={`circle-${idx}`}
            center={{ lat: c.lat, lng: c.lng }}
            radius={c.radius}
            options={{
              fillColor: c.color || "#047857",
              fillOpacity: 0.15,
              strokeColor: c.color || "#047857",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        ))}

        {markers.map((m, idx) => (
          <Marker
            key={`marker-${idx}`}
            position={{ lat: m.lat, lng: m.lng }}
            onClick={() => setSelectedMarker(m)}
          />
        ))}

        {selectedMarker && selectedMarker.sublabel && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div style={{ fontFamily: "Manrope, sans-serif", padding: "2px", color: "#0f172a" }}>
              <strong style={{ fontSize: "14px", display: "block" }}>{selectedMarker.label}</strong>
              <p style={{ fontSize: "12px", margin: "4px 0 0 0", color: "#475569" }}>{selectedMarker.sublabel}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
