"use client";

import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("@/components/map-component").then((mod) => mod.MapComponent), {
  ssr: false,
});

export function LazyMap(props: {
  center: [number, number];
  zoom: number;
  markers: Array<{ lat: number; lng: number; label: string; sublabel?: string; color?: string }>;
  circles: Array<{ lat: number; lng: number; radius: number; color?: string }>;
  height?: string;
}) {
  return <DynamicMap {...props} height={props.height || "440px"} />;
}
