"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

/** Número que cuenta de 0 a `value` cuando entra en viewport. */
export default function StatCounter({
  value,
  decimals = 0,
  formatter,
}: {
  value: number;
  decimals?: number;
  /** Formato personalizado del número (ej. separadores de miles o "130.3K"). */
  formatter?: (v: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = formatter ? formatter(v) : v.toFixed(decimals);
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals, formatter]);

  return <span ref={ref}>0</span>;
}

/** 130300 → "130.3K", 1200000 → "1.2M", 980 → "980". */
export function abbreviate(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return Math.round(v).toString();
}

/** 249812 → "249.812" (separador de miles estilo es). */
export function thousands(v: number): string {
  return new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(v);
}
