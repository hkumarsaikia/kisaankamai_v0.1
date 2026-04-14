"use client";

import { RouteTransitionShell } from "@/components/RouteTransitionShell";

export default function OwnerRegistrationTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteTransitionShell className="w-full">{children}</RouteTransitionShell>;
}
