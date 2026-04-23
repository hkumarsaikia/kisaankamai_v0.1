"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { SharedIcon } from "@/components/SharedIcon";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  const isDark = resolvedTheme === "dark";
  const label = isDark ? t("theme.switch_to_light_mode") : t("theme.switch_to_dark_mode");

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="kk-icon-button"
      aria-label={label}
      title={label}
    >
      <SharedIcon name={isDark ? "sun" : "moon"} className="h-5 w-5" />
    </button>
  );
}
