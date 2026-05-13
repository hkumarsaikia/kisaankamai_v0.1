"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageContext";

export type EquipmentSortKey = "availability" | "price-asc" | "distance";

type EquipmentSortMenuProps = {
  sortBy: EquipmentSortKey;
  onSortChange: (value: EquipmentSortKey) => void;
  variant?: "surface" | "primary";
  className?: string;
};

const SORT_OPTIONS: Array<{
  value: EquipmentSortKey;
  label: { en: string; mr: string };
  description: { en: string; mr: string };
  icon: string;
}> = [
  {
    value: "availability",
    label: { en: "Available equipment first", mr: "उपलब्ध उपकरणे आधी" },
    description: { en: "Ready-to-book listings stay on top.", mr: "बुकिंगसाठी तयार लिस्टिंग वर दिसतात." },
    icon: "check_circle",
  },
  {
    value: "price-asc",
    label: { en: "Lowest price first", mr: "सर्वात कमी किंमत आधी" },
    description: { en: "Sort by the listed hourly rate.", mr: "लिस्ट केलेल्या प्रति तास दरानुसार क्रम लावा." },
    icon: "currency_rupee",
  },
  {
    value: "distance",
    label: { en: "Nearest equipment first", mr: "जवळची उपकरणे आधी" },
    description: { en: "Prioritize shorter travel distance.", mr: "कमी अंतर असलेल्या उपकरणांना प्राधान्य द्या." },
    icon: "near_me",
  },
];

export function EquipmentSortMenu({
  sortBy,
  onSortChange,
  variant = "surface",
  className = "",
}: EquipmentSortMenuProps) {
  const { langText } = useLanguage();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const isPrimary = variant === "primary";
  const activeOption = SORT_OPTIONS.find((option) => option.value === sortBy) || SORT_OPTIONS[0];

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-controls={menuId}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`group inline-flex h-11 w-full min-w-[12.5rem] items-center justify-between gap-3 rounded-xl px-4 text-sm font-black shadow-sm transition-[background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
          isPrimary
            ? "border border-primary/20 bg-primary text-white hover:bg-primary-container hover:shadow-lg dark:border-emerald-400/20 dark:bg-emerald-900 dark:text-white dark:hover:bg-emerald-800"
            : "border border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary/30 hover:bg-surface-container-low hover:shadow-md"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="material-symbols-outlined text-[19px]">sort</span>
          <span className="truncate">{langText(activeOption.label.en, activeOption.label.mr)}</span>
        </span>
        <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      <div
        id={menuId}
        role="listbox"
        aria-label={langText("Sort results", "निकाल क्रम लावा")}
        aria-hidden={!open}
        className={`absolute right-0 top-[calc(100%+0.5rem)] z-40 w-[min(21rem,calc(100vw-2rem))] origin-top-right rounded-2xl border border-emerald-100 bg-white p-2 shadow-2xl shadow-emerald-950/15 outline-none transition-[opacity,transform] duration-200 dark:border-slate-700 dark:bg-slate-950 dark:shadow-black/30 ${
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {SORT_OPTIONS.map((option) => {
          const active = option.value === sortBy;
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={active}
              tabIndex={open ? 0 : -1}
              onClick={() => {
                onSortChange(option.value);
                setOpen(false);
              }}
              className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-[background-color,transform] duration-150 hover:-translate-y-0.5 ${
                active
                  ? "bg-emerald-50 text-primary dark:bg-emerald-500/10 dark:text-emerald-200"
                  : "text-on-surface hover:bg-surface-container-low dark:text-slate-100 dark:hover:bg-slate-900"
              }`}
            >
              <span className={`material-symbols-outlined mt-0.5 text-[21px] ${active ? "text-primary dark:text-emerald-200" : "text-on-surface-variant dark:text-slate-300"}`}>
                {option.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black">{langText(option.label.en, option.label.mr)}</span>
                <span className="mt-0.5 block text-xs font-semibold leading-5 text-on-surface-variant">
                  {langText(option.description.en, option.description.mr)}
                </span>
              </span>
              {active ? <span className="material-symbols-outlined text-[18px] text-primary dark:text-emerald-200">done</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
