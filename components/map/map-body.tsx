"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SURFACE_MAPS } from "@/data/maps";
import type { PlanetId } from "@/data/types";
import { cn } from "@/lib/cn";
import { clampTranslate, clampZoom } from "@/lib/geo";
import type { PinGroup } from "@/lib/pins";
import { MapPin } from "./map-pin";

export interface MapView {
  zoom: number;
  translate: { x: number; y: number };
}

const PAN_STEP = 60;

export function MapBody({
  planet,
  groups,
  selectedKey,
  onSelect,
  view,
  onViewChange,
}: {
  planet: PlanetId;
  groups: PinGroup[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  view: MapView;
  onViewChange: (next: MapView) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; t: MapView["translate"]; id: number } | null>(null);
  // Latest values for the native wheel listener, which is bound once.
  const latest = useRef({ view, size, onViewChange });
  useEffect(() => {
    latest.current = { view, size, onViewChange };
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Re-clamp whenever the viewport resizes or the view is changed from outside (zoom buttons).
  useEffect(() => {
    if (!size.w) return;
    const t = clampTranslate(view.translate, view.zoom, size.w, size.h);
    if (t.x !== view.translate.x || t.y !== view.translate.y) onViewChange({ zoom: view.zoom, translate: t });
  }, [view, size, onViewChange]);

  // Wheel zoom toward the cursor. Bound natively so preventDefault works (React wheel listeners are passive).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { view: v, size: s, onViewChange: change } = latest.current;
      const rect = el.getBoundingClientRect();
      const p = { x: e.clientX - rect.left - s.w / 2, y: e.clientY - rect.top - s.h / 2 };
      const zoom = clampZoom(v.zoom * (e.deltaY < 0 ? 1.2 : 1 / 1.2));
      const m = { x: (p.x - v.translate.x) / v.zoom, y: (p.y - v.translate.y) / v.zoom };
      change({ zoom, translate: clampTranslate({ x: p.x - m.x * zoom, y: p.y - m.y * zoom }, zoom, s.w, s.h) });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const pan = (dx: number, dy: number) =>
    onViewChange({
      zoom: view.zoom,
      translate: clampTranslate({ x: view.translate.x + dx, y: view.translate.y + dy }, view.zoom, size.w, size.h),
    });

  const zoomBy = (factor: number) => {
    const zoom = clampZoom(view.zoom * factor);
    const ratio = zoom / view.zoom;
    onViewChange({
      zoom,
      translate: clampTranslate({ x: view.translate.x * ratio, y: view.translate.y * ratio }, zoom, size.w, size.h),
    });
  };

  const map = SURFACE_MAPS[planet];

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="group"
      aria-roledescription="map"
      aria-label={`${planet === "moon" ? "Moon" : "Mars"} surface map. Arrow keys pan, plus and minus zoom, 0 resets.`}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        const keys: Record<string, () => void> = {
          ArrowLeft: () => pan(PAN_STEP, 0),
          ArrowRight: () => pan(-PAN_STEP, 0),
          ArrowUp: () => pan(0, PAN_STEP),
          ArrowDown: () => pan(0, -PAN_STEP),
          "+": () => zoomBy(1.4),
          "=": () => zoomBy(1.4),
          "-": () => zoomBy(1 / 1.4),
          "0": () => onViewChange({ zoom: 1, translate: { x: 0, y: 0 } }),
        };
        const action = keys[e.key];
        if (action) {
          e.preventDefault();
          action();
        }
      }}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button") || view.zoom === 1) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { x: e.clientX, y: e.clientY, t: view.translate, id: e.pointerId };
        setDragging(true);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        onViewChange({
          zoom: view.zoom,
          translate: clampTranslate({ x: d.t.x + e.clientX - d.x, y: d.t.y + e.clientY - d.y }, view.zoom, size.w, size.h),
        });
      }}
      onPointerUp={() => {
        drag.current = null;
        setDragging(false);
      }}
      onPointerCancel={() => {
        drag.current = null;
        setDragging(false);
      }}
      className={cn(
        "nb-card relative aspect-[2/1] w-full touch-none select-none overflow-hidden bg-ink",
        view.zoom > 1 && (dragging ? "cursor-grabbing" : "cursor-grab"),
      )}
    >
      <div
        className={cn("absolute inset-0 origin-center", !dragging && "transition-transform duration-200 ease-out")}
        style={{ transform: `translate(${view.translate.x}px, ${view.translate.y}px) scale(${view.zoom})` }}
      >
        <Image
          key={planet}
          src={map.src}
          alt={map.alt}
          fill
          preload
          sizes="(min-width: 1180px) 1148px, 100vw"
          draggable={false}
          className="object-cover"
        />
        {/* Graticule: equator and prime meridian, plus 30° lines. */}
        <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 360 180" preserveAspectRatio="none">
          {[-150, -120, -90, -60, -30, 30, 60, 90, 120, 150].map((lon) => (
            <line key={lon} x1={lon + 180} x2={lon + 180} y1={0} y2={180} stroke="rgba(233,229,218,0.08)" strokeWidth={0.2} vectorEffect="non-scaling-stroke" />
          ))}
          {[-60, -30, 30, 60].map((lat) => (
            <line key={lat} x1={0} x2={360} y1={90 - lat} y2={90 - lat} stroke="rgba(233,229,218,0.08)" strokeWidth={0.2} vectorEffect="non-scaling-stroke" />
          ))}
          <line x1={0} x2={360} y1={90} y2={90} stroke="rgba(1,255,204,0.55)" strokeWidth={0.3} vectorEffect="non-scaling-stroke" />
          <line x1={180} x2={180} y1={0} y2={180} stroke="rgba(1,255,204,0.55)" strokeWidth={0.3} vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      <div className="pointer-events-none absolute inset-0 [&>button]:pointer-events-auto">
        {groups.map((group) => (
          <MapPin
            key={group.key}
            group={group}
            selected={group.key === selectedKey}
            zoom={view.zoom}
            translate={view.translate}
            onSelect={onSelect}
          />
        ))}
      </div>

      <div aria-hidden className="pointer-events-none absolute bottom-2 right-2 border-2 border-rule bg-panel px-1.5 font-mono text-micro font-bold uppercase tracking-wider text-ink">
        0° · equirectangular · ×{view.zoom.toFixed(1)}
      </div>
    </div>
  );
}
