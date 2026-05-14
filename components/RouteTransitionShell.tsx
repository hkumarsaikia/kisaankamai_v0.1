"use client";

import { usePathname } from "next/navigation";

export function RouteTransitionShell({
  children,
  className,
  enabled = true,
}: {
  children: React.ReactNode;
  className?: string;
  enabled?: boolean;
}) {
  const pathname = usePathname();

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      key={pathname}
      className={className ? `${className} kk-route-shell-enter` : "kk-route-shell-enter"}
    >
      {children}
    </div>
  );
}
