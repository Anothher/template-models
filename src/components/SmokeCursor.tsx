"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
};

/**
 * Estela de humo carmesí que sigue el cursor (y el dedo en táctil).
 * Canvas fijo sobre toda la página; las partículas ascienden y se disipan.
 */
export default function SmokeCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    const particles: Particle[] = [];
    // en táctil (móvil) menos partículas para cuidar batería y FPS
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const maxParticles = coarse ? 110 : 240;
    const perSpawn = coarse ? 1 : 2;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (x: number, y: number) => {
      for (let i = 0; i < perSpawn; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.7,
          vy: -0.5 - Math.random() * 0.9,
          life: 0,
          maxLife: 55 + Math.random() * 55,
          size: 9 + Math.random() * 16,
        });
      }
      if (particles.length > maxParticles)
        particles.splice(0, particles.length - maxParticles);
      // el bucle solo corre mientras haya humo; en reposo, cero trabajo
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    // dentro de zonas interactivas pesadas (ej. el carrusel) no se genera
    // humo: el canvas no debe competir por GPU con el arrastre
    const blocked = (target: EventTarget | null) =>
      target instanceof Element && target.closest("[data-no-smoke]") !== null;

    const onMove = (e: PointerEvent) => {
      if (!blocked(e.target)) spawn(e.clientX, e.clientY);
    };
    // en móvil pointermove se corta cuando el navegador toma el gesto para
    // hacer scroll; touchmove sí sigue disparándose durante todo el gesto
    const onTouch = (e: TouchEvent) => {
      if (blocked(e.target)) return;
      const t = e.touches[0];
      if (t) spawn(t.clientX, t.clientY);
    };
    if (coarse) {
      window.addEventListener("touchmove", onTouch, { passive: true });
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (particles.length === 0) {
        running = false;
        return;
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.size += 0.28;
        const t = p.life / p.maxLife;
        const alpha = 0.14 * (1 - t);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        g.addColorStop(0, `rgba(220, 20, 60, ${alpha})`);
        g.addColorStop(0.5, `rgba(130, 70, 100, ${alpha * 0.55})`);
        g.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-60"
    />
  );
}
