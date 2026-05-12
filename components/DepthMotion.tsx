"use client";

import { useEffect } from "react";

const TILE_SELECTOR = ".kk-depth-tile:not([data-depth-motion='static'])";

function resetTile(tile: HTMLElement) {
  tile.style.setProperty("--kk-depth-rotate-x", "0deg");
  tile.style.setProperty("--kk-depth-rotate-y", "0deg");
  tile.style.setProperty("--kk-depth-glare-x", "50%");
  tile.style.setProperty("--kk-depth-glare-y", "0%");
}

export function DepthMotion() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      return;
    }

    let activeTile: HTMLElement | null = null;
    let pendingEvent: PointerEvent | null = null;
    let animationFrame = 0;

    const applyPointerMove = () => {
      animationFrame = 0;
      const event = pendingEvent;
      pendingEvent = null;

      if (!event) {
        return;
      }

      const target = event.target instanceof Element ? event.target.closest(TILE_SELECTOR) : null;
      if (!(target instanceof HTMLElement)) {
        if (activeTile) {
          resetTile(activeTile);
          activeTile = null;
        }
        return;
      }

      activeTile = target;
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 6;
      const rotateX = (0.5 - y) * 5.5;

      target.style.setProperty("--kk-depth-rotate-x", `${rotateX.toFixed(2)}deg`);
      target.style.setProperty("--kk-depth-rotate-y", `${rotateY.toFixed(2)}deg`);
      target.style.setProperty("--kk-depth-glare-x", `${Math.round(x * 100)}%`);
      target.style.setProperty("--kk-depth-glare-y", `${Math.round(y * 100)}%`);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pendingEvent = event;

      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(applyPointerMove);
      }
    };

    const handlePointerOut = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest(TILE_SELECTOR) : null;
      const related = event.relatedTarget instanceof Element ? event.relatedTarget.closest(TILE_SELECTOR) : null;
      if (target instanceof HTMLElement && target !== related) {
        resetTile(target);
        if (activeTile === target) {
          activeTile = null;
        }
      }
    };

    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerout", handlePointerOut);
    };
  }, []);

  return null;
}
