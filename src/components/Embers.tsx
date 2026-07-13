"use client";

import { useEffect, useState } from "react";

type Ember = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
};

/**
 * Partículas tipo brasas/chispas que ascienden lentamente.
 * Se generan en cliente (useEffect) para evitar mismatch de hidratación.
 */
export default function Embers({ count = 26 }: { count?: number }) {
  const [embers, setEmbers] = useState<Ember[]>([]);

  useEffect(() => {
    // menos partículas en pantallas pequeñas para cuidar el rendimiento
    const n =
      window.innerWidth < 640 ? Math.max(8, Math.round(count * 0.55)) : count;
    setEmbers(
      Array.from({ length: n }, () => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 9 + Math.random() * 14,
        delay: -Math.random() * 20,
        drift: (Math.random() - 0.5) * 160,
        opacity: 0.25 + Math.random() * 0.55,
      }))
    );
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {embers.map((e, i) => (
        <span
          key={i}
          className="ember"
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
            ["--ember-drift" as string]: `${e.drift}px`,
            ["--ember-opacity" as string]: e.opacity,
          }}
        />
      ))}
    </div>
  );
}
