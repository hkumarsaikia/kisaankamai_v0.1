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

const OPEN_STREET_MAP_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

function createLeafletMarkerIcon(color = "#047857") {
  return L.divIcon({
    className: "kk-leaflet-marker",
    html: `
      <span style="
        display:flex;
        align-items:center;
        justify-content:center;
        width:20px;
        height:20px;
        border-radius:999px;
        background:${color};
        border:3px solid #ffffff;
        box-shadow:0 10px 24px rgba(15, 23, 42, 0.28);
      "></span>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -14],
  });
}

function FitLeafletBounds({
  center,
  markers,
  zoom,
}: {
  center: [number, number];
  markers: MapMarker[];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 1) {
      const bounds = L.latLngBounds(markers.map((marker) => [marker.lat, marker.lng] as [number, number]));
      map.fitBounds(bounds, {
        padding: [36, 36],
        maxZoom: zoom,
      });
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

function LeafletMapView({
  center,
  zoom,
  markers,
  circles,
  height,
  className,
  showControls,
}: Required<MapComponentProps>) {
  const leafletIcons = useMemo(
    () => markers.map((marker) => createLeafletMarkerIcon(marker.color)),
    [markers]
  );

  return (
    <div
      className={`overflow-hidden rounded-3xl border border-slate-200 shadow-xl dark:border-slate-800 ${className}`}
      style={{ height, width: "100%" }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={showControls}
        zoomControl={showControls}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url={OPEN_STREET_MAP_TILES}
        />
        <FitLeafletBounds center={center} markers={markers} zoom={zoom} />

        {circles.map((circle, index) => (
          <LeafletCircle
            key={`leaflet-circle-${index}`}
            center={[circle.lat, circle.lng]}
            radius={circle.radius}
            pathOptions={{
              color: circle.color || "#047857",
              fillColor: circle.color || "#047857",
              fillOpacity: 0.14,
              weight: 2,
            }}
          />
        ))}

        {markers.map((marker, index) => (
          <LeafletMarker
            key={`leaflet-marker-${index}`}
            position={[marker.lat, marker.lng]}
            icon={leafletIcons[index]}
          >
            <Popup>
              <div className="min-w-[160px] font-sans text-slate-900">
                <strong className="block text-sm">{marker.label}</strong>
                {marker.sublabel ? <p className="mt-1 text-xs text-slate-600">{marker.sublabel}</p> : null}
              </div>
            </Popup>
          </LeafletMarker>
        ))}
      </MapContainer>
    </div>
  );
}

function GoogleMapView({
  apiKey,
  center,
  zoom,
  markers,
  circles,
  height,
  className,
  showControls,
}: Required<MapComponentProps> & { apiKey: string }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const centerObj = useMemo(() => ({ lat: center[0], lng: center[1] }), [center]);

  if (loadError) {
    return (
      <LeafletMapView
        center={center}
        zoom={zoom}
        markers={markers}
        circles={circles}
        height={height}
        className={className}
        showControls={showControls}
      />
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-900/50 ${className}`}
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
        onLoad={(mapInstance) => {
          if (markers.length > 1) {
            const bounds = new window.google.maps.LatLngBounds();
            markers.forEach((marker) => bounds.extend({ lat: marker.lat, lng: marker.lng }));
            mapInstance.fitBounds(bounds);
          }
        }}
        options={{
          mapTypeControl: showControls,
          zoomControl: showControls,
          streetViewControl: false,
          fullscreenControl: showControls,
          mapTypeId: "terrain",
        }}
      >
        {circles.map((circle, index) => (
          <GoogleCircle
            key={`google-circle-${index}`}
            center={{ lat: circle.lat, lng: circle.lng }}
            radius={circle.radius}
            options={{
              fillColor: circle.color || "#047857",
              fillOpacity: 0.15,
              strokeColor: circle.color || "#047857",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        ))}

        {markers.map((marker, index) => (
          <GoogleMarker
            key={`google-marker-${index}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}

        {selectedMarker ? (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div style={{ fontFamily: "Manrope, sans-serif", padding: "2px", color: "#0f172a" }}>
              <strong style={{ fontSize: "14px", display: "block" }}>{selectedMarker.label}</strong>
              {selectedMarker.sublabel ? (
                <p style={{ fontSize: "12px", margin: "4px 0 0 0", color: "#475569" }}>
                  {selectedMarker.sublabel}
                </p>
              ) : null}
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
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
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();

  if (!apiKey) {
    return (
      <LeafletMapView
        center={center}
        zoom={zoom}
        markers={markers}
        circles={circles}
        height={height}
        className={className}
        showControls={showControls}
      />
    );
  }

  return (
    <GoogleMapView
      apiKey={apiKey}
      center={center}
      zoom={zoom}
      markers={markers}
      circles={circles}
      height={height}
      className={className}
      showControls={showControls}
    />
  );
}
