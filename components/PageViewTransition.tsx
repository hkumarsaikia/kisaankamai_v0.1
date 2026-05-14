import { ViewTransition, type ReactNode } from "react";

export function PageViewTransition({ children, viewKey }: { children: ReactNode; viewKey: string }) {
  return (
    <ViewTransition
      key={viewKey}
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "fade-in" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "fade-out" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
