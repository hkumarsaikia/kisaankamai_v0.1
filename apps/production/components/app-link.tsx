import Link, { type LinkProps } from "next/link";
import type { PropsWithChildren } from "react";

export function AppLink({
  children,
  className,
  ...props
}: PropsWithChildren<LinkProps & { className?: string }>) {
  return (
    <Link {...props} className={className}>
      {children}
    </Link>
  );
}
