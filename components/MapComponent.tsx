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
import "leaflet/dist/leaflet.css";
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

const LEAFLET_TILE_SOURCES = [
  {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
  },
  {
    name: "CARTO",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>',
  },
] as const;

const TILE_ERROR_THRESHOLD = 6;

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

function SyncLeafletSize() {
  const map = useMap();

  useEffect(() => {
    const refresh = () => {
      map.invalidateSize({
        pan: false,
        debounceMoveend: true,
      });
    };

    const timeout = window.setTimeout(refresh, 120);
    window.addEventListener("resize", refresh);

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(refresh)
        : null;

    if (observer) {
      observer.observe(map.getContainer());
    }

    return () => {
      window.clearTimeout(timeout);
      observer?.disconnect();
      window.removeEventListener("resize", refresh);
    };
  }, [map]);

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
  const [providerIndex, setProviderIndex] = useState(0);
  const [tileErrors, setTileErrors] = useState(0);
  const [providerLoaded, setProviderLoaded] = useState(false);
  const [showFallbackState, setShowFallbackState] = useState(false);
  const leafletIcons = useMemo(
    () => markers.map((marker) => createLeafletMarkerIcon(marker.color)),
    [markers]
  );
  const activeProvider = LEAFLET_TILE_SOURCES[providerIndex];

  useEffect(() => {
    setProviderLoaded(false);
    setTileErrors(0);
    setShowFallbackState(false);
  }, [providerIndex]);

  useEffect(() => {
    if (providerLoaded || tileErrors < TILE_ERROR_THRESHOLD) {
      return;
    }

    if (providerIndex < LEAFLET_TILE_SOURCES.length - 1) {
      setProviderIndex((current) => current + 1);
      return;
    }

    setShowFallbackState(true);
  }, [providerIndex, providerLoaded, tileErrors]);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-200 shadow-xl dark:border-slate-800 ${className}`}
      style={{ height, width: "100%" }}
    >
      {!providerLoaded && !showFallbackState ? (
        <div className="pointer-events-none absolute inset-0 z-[400] flex items-start justify-between bg-gradient-to-br from-white/70 via-white/30 to-transparent p-5 text-slate-700 dark:from-slate-950/55 dark:via-slate-950/20 dark:text-slate-200">
          <div className="rounded-2xl border border-white/80 bg-white/85 px-4 py-3 text-sm font-semibold shadow-lg dark:border-slate-800/70 dark:bg-slate-950/85">
            Loading map tiles...
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] shadow-lg dark:border-slate-800/70 dark:bg-slate-950/85">
            {activeProvider.name}
          </div>
        </div>
      ) : null}
      {showFallbackState ? (
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-surface-container-lowest/92 p-6 backdrop-blur-sm dark:bg-surface-container-lowest/90">
          <div className="max-w-md rounded-[1.75rem] border border-outline-variant bg-surface-container-lowest p-6 text-center shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">Map temporarily unavailable</p>
            <h3 className="mt-3 text-2xl font-black text-primary">Service regions are still active</h3>
            <p className="mt-3 text-sm font-medium leading-6 text-on-surface-variant">
              We could not load the live tile provider right now. The current operating areas shown in this section are listed below.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {markers.map((marker) => (
                <span
                  key={`${marker.label}-${marker.lat}-${marker.lng}`}
                  className="rounded-full border border-outline-variant bg-surface-container-low px-4 py-2 text-sm font-bold text-on-surface"
                >
                  {marker.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={showControls}
        zoomControl={showControls}
        className="h-full w-full"
      >
        <SyncLeafletSize />
        <TileLayer
          key={activeProvider.url}
          attribution={activeProvider.attribution}
          url={activeProvider.url}
          eventHandlers={{
            load: () => {
              setProviderLoaded(true);
              setTileErrors(0);
              setShowFallbackState(false);
            },
            tileerror: () => {
              setTileErrors((current) => current + 1);
            },
          }}
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
        className={`relative animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-900/50 ${className}`}
        style={{ height }}
      >
        <div className="absolute left-5 top-5 rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg dark:border-slate-800/60 dark:bg-slate-950/85 dark:text-slate-200">
          Loading Google Maps...
        </div>
      </div>
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
