"use client";

import { RouteTransitionShell } from "@/components/RouteTransitionShell";

export default function OwnerProfileTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteTransitionShell className="w-full">{children}</RouteTransitionShell>;
}

