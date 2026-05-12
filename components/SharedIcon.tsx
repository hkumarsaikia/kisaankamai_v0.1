import type { SVGProps } from "react";

type SharedIconName =
  | "menu"
  | "close"
  | "sun"
  | "moon"
  | "youtube"
  | "send"
  | "location"
  | "chevron-left"
  | "chevron-right"
  | "search"
  | "arrow-up"
  | "arrow-right"
  | "verified"
  | "support"
  | "payments"
  | "star"
  | "plus"
  | "agriculture";

type SharedIconProps = SVGProps<SVGSVGElement> & {
  name: SharedIconName;
  title?: string;
};

function renderIcon(name: SharedIconName) {
  switch (name) {
    case "menu":
      return (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      );
    case "close":
      return (
        <path
          d="M6 6l12 12M18 6 6 18"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      );
    case "sun":
      return (
        <>
          <circle
            cx="12"
            cy="12"
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07 6.7 17.3M17.3 6.7l1.77-1.77"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </>
      );
    case "moon":
      return (
        <path
          d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a7.5 7.5 0 1 0 11 11Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      );
    case "youtube":
      return (
        <>
          <rect
            x="3"
            y="6"
            width="18"
            height="12"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" />
        </>
      );
    case "send":
      return (
        <>
          <path
            d="M21 3 10 14"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m21 3-7 18-3-7-7-3 17-8Z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </>
      );
    case "location":
      return (
        <>
          <path
            d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="12" cy="11" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
        </>
      );
    case "chevron-left":
      return (
        <path
          d="m15 6-6 6 6 6"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      );
    case "chevron-right":
      return (
        <path
          d="m9 6 6 6-6 6"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      );
    case "search":
      return (
        <>
          <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
          <path
            d="m20 20-4.35-4.35"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </>
      );
    case "arrow-right":
      return (
        <path
          d="M5 12h14m-5-5 5 5-5 5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      );
    case "arrow-up":
      return (
        <path
          d="M12 19V5m-5 5 5-5 5 5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      );
    case "verified":
      return (
        <>
          <path
            d="M12 3.5 18 6v5c0 4.13-2.55 7.6-6 9-3.45-1.4-6-4.87-6-9V6l6-2.5Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="m9.5 11.75 1.75 1.75 3.25-3.5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </>
      );
    case "support":
      return (
        <>
          <path
            d="M4 13v-1a8 8 0 1 1 16 0v1"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            d="M5.5 12.5H7v5H5.5A1.5 1.5 0 0 1 4 16v-2a1.5 1.5 0 0 1 1.5-1.5Zm11.5 0H18.5A1.5 1.5 0 0 1 20 14v2a1.5 1.5 0 0 1-1.5 1.5Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M9.5 19h5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </>
      );
    case "payments":
      return (
        <>
          <rect
            x="3"
            y="6"
            width="18"
            height="12"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M3 10h18M7 14h4" fill="none" stroke="currentColor" strokeWidth="2" />
        </>
      );
    case "star":
      return (
        <path
          d="m12 3.25 2.55 5.16 5.7.83-4.13 4.03.98 5.68L12 16.27 6.9 18.95l.98-5.68L3.75 9.24l5.7-.83L12 3.25Z"
          fill="currentColor"
          stroke="none"
        />
      );
    case "plus":
      return (
        <path
          d="M12 5v14M5 12h14"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      );
    case "agriculture":
      return (
        <>
          <path
            d="M12 21V9"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            d="M12 12c-3.5 0-6-2.5-6-6 3.5 0 6 2.5 6 6Zm0 4c3.5 0 6-2.5 6-6-3.5 0-6 2.5-6 6Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </>
      );
  }
}

export function SharedIcon({ name, className, title, ...props }: SharedIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden={title ? undefined : true}
      className={className}
      fill="none"
      focusable="false"
      role={title ? "img" : "presentation"}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {renderIcon(name)}
    </svg>
  );
}
