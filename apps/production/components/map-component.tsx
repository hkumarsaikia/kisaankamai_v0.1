"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Circle as GoogleCircle,
  GoogleMap,
  InfoWindow,
  Marker as GoogleMarker,
  useJsApiLoader,
} from "@react-google-maps/api";
import L from "leaflet";
import { Circle as LeafletCircle, MapContainer, Marker as LeafletMarker, Popup, TileLayer, useMap } from "react-leaflet";

interface MarkerShape {
  lat: number;
  lng: number;
  label: string;
  sublabel?: string;
  color?: string;
}

interface CircleShape {
  lat: number;
  lng: number;
  radius: number;
  color?: string;
}

function createLeafletIcon(color = "#1f7d56") {
  return L.divIcon({
    className: "kk-production-leaflet-marker",
    html: `<span style="display:flex;width:18px;height:18px;border-radius:999px;background:${color};border:3px solid #fff;box-shadow:0 8px 20px rgba(15,23,42,0.28)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function FitBounds({ markers, center, zoom }: { markers: MarkerShape[]; center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 1) {
      const bounds = L.latLngBounds(markers.map((marker) => [marker.lat, marker.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: zoom });
      return;
    }

    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], zoom);
      return;
    }

    map.setView(center, zoom);
  }, [center, map, markers, zoom]);

  return null;
}

function LeafletMap({
  center,
  zoom,
  markers,
  circles,
  height,
}: {
  center: [number, number];
  zoom: number;
  markers: MarkerShape[];
  circles: CircleShape[];
  height: string;
}) {
  const icons = useMemo(() => markers.map((marker) => createLeafletIcon(marker.color)), [markers]);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-soft dark:border-slate-800" style={{ height }}>
      <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds center={center} markers={markers} zoom={zoom} />
        {circles.map((circle, index) => (
          <LeafletCircle
            key={`circle-${index}`}
            center={[circle.lat, circle.lng]}
            radius={circle.radius}
            pathOptions={{
              color: circle.color || "#1f7d56",
              fillColor: circle.color || "#1f7d56",
              fillOpacity: 0.12,
            }}
          />
        ))}
        {markers.map((marker, index) => (
          <LeafletMarker key={`marker-${index}`} position={[marker.lat, marker.lng]} icon={icons[index]}>
            <Popup>
              <div className="min-w-[180px]">
                <strong className="block text-sm text-slate-900">{marker.label}</strong>
                {marker.sublabel ? <p className="mt-1 text-xs text-slate-600">{marker.sublabel}</p> : null}
              </div>
            </Popup>
          </LeafletMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export function MapComponent({
  center,
  zoom,
  markers,
  circles,
  height,
}: {
  center: [number, number];
  zoom: number;
  markers: MarkerShape[];
  circles: CircleShape[];
  height: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useJsApiLoader({
    id: "kk-production-map",
    googleMapsApiKey: apiKey || "",
  });
  const [selected, setSelected] = useState<MarkerShape | null>(null);

  if (!apiKey || loadError || !isLoaded) {
    return <LeafletMap center={center} zoom={zoom} markers={markers} circles={circles} height={height} />;
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-soft dark:border-slate-800" style={{ height }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={{ lat: center[0], lng: center[1] }}
        zoom={zoom}
      >
        {circles.map((circle, index) => (
          <GoogleCircle
            key={`google-circle-${index}`}
            center={{ lat: circle.lat, lng: circle.lng }}
            radius={circle.radius}
            options={{
              fillColor: circle.color || "#1f7d56",
              fillOpacity: 0.12,
              strokeColor: circle.color || "#1f7d56",
              strokeWeight: 2,
            }}
          />
        ))}
        {markers.map((marker, index) => (
          <GoogleMarker
            key={`google-marker-${index}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => setSelected(marker)}
          />
        ))}
        {selected ? (
          <InfoWindow position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => setSelected(null)}>
            <div className="min-w-[180px]">
              <strong className="block text-sm text-slate-900">{selected.label}</strong>
              {selected.sublabel ? <p className="mt-1 text-xs text-slate-600">{selected.sublabel}</p> : null}
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}
