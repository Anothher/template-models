"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ContentItem } from "@/lib/creators";

gsap.registerPlugin(ScrollTrigger);

/**
 * Carrusel circular 3D: las cartas orbitan alrededor del centro, la frontal
 * se eleva con glow. Gira solo, se arrastra con inercia (mouse o dedo) y el
 * scroll lo impulsa. Tap en la carta libre → lightbox; en una bloqueada → OF.
 *
 * Rendimiento: solo se animan transform y opacity (composición GPU pura).
 * Nada de filter/box-shadow dinámicos, que re-rasterizan en cada frame.
 */
export default function Carousel3D({
  items,
  ofUrl,
}: {
  items: ContentItem[];
  ofUrl: string;
}) {
  const step = 360 / items.length;
  const rotation = useMotionValue(0);
  const [radius, setRadius] = useState(280);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const moved = useRef(0);
  // el dedo mueve un "objetivo"; la rotación real lo persigue interpolada,
  // así los eventos irregulares del puntero no producen saltos
  const targetRotation = useRef(0);
  const velocity = useRef(0);
  const scrollSpin = useRef(0);

  useEffect(() => {
    const update = () =>
      setRadius(Math.min(330, Math.max(170, window.innerWidth * 0.38)));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // el scroll impulsa el giro: mientras el carrusel está en pantalla,
  // la velocidad de scroll se convierte en velocidad de rotación
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        // impulso suave: se mezcla con el valor anterior en vez de saltar
        const target = gsap.utils.clamp(-1.1, 1.1, self.getVelocity() * -0.0005);
        scrollSpin.current += (target - scrollSpin.current) * 0.25;
      },
    });
    return () => st.kill();
  }, []);

  useAnimationFrame((_, delta) => {
    const dt = Math.min(delta / 16.7, 3);
    if (dragging.current) {
      // persigue el dedo con suavizado exponencial
      const current = rotation.get();
      rotation.set(
        current + (targetRotation.current - current) * Math.min(1, 0.35 * dt)
      );
      return;
    }
    // inercia + giro automático mezclados gradualmente: el auto-giro entra
    // a medida que la inercia muere, sin cambio brusco
    const autoBlend = 1 - Math.min(1, Math.abs(velocity.current) / 0.5);
    const spin = velocity.current + scrollSpin.current + 0.045 * autoBlend;
    rotation.set(rotation.get() + spin * dt);
    velocity.current *= Math.pow(0.955, dt);
    scrollSpin.current *= Math.pow(0.9, dt);
  });

  const handleSelect = (item: ContentItem) => {
    // si hubo arrastre real, no es un tap
    if (moved.current > 8) return;
    if (item.locked) {
      window.open(ofUrl, "_blank", "noopener,noreferrer");
    } else if (item.image) {
      setLightbox(item.image);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        data-no-smoke
        className="relative mx-auto w-full max-w-2xl cursor-grab select-none active:cursor-grabbing"
        style={{
          perspective: "1100px",
          height: "min(90vw, 480px)",
          touchAction: "pan-y",
        }}
        onPointerDown={(e) => {
          dragging.current = true;
          lastX.current = e.clientX;
          moved.current = 0;
          targetRotation.current = rotation.get();
          velocity.current = 0;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          const dx = e.clientX - lastX.current;
          lastX.current = e.clientX;
          moved.current += Math.abs(dx);
          targetRotation.current += dx * 0.3;
          // velocidad promediada (EMA): el lanzamiento usa el gesto completo,
          // no solo el último evento del puntero
          velocity.current = velocity.current * 0.75 + dx * 0.3 * 0.25;
        }}
        onPointerUp={() => {
          dragging.current = false;
          velocity.current = Math.max(-4, Math.min(4, velocity.current));
        }}
        onPointerCancel={() => (dragging.current = false)}
      >
        {/* escenario: foco central + anillo giratorio + piso con glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* foco de luz tras las cartas */}
          <div
            className="absolute left-1/2 top-1/2 h-[135%] w-[150%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(ellipse 52% 46% at 50% 46%, rgba(220,20,60,0.08), rgba(88,28,135,0.05) 48%, transparent 72%)",
            }}
          />
          {/* resplandor suave justo bajo las cartas, como luz reflejada */}
          <div
            className="absolute bottom-[9%] left-1/2 h-8 w-1/2 -translate-x-1/2 rounded-[100%]"
            style={{
              background:
                "radial-gradient(ellipse, rgba(220,20,60,0.2), transparent 70%)",
              filter: "blur(14px)",
            }}
          />
        </div>
        <div className="absolute inset-0" style={{ }}>
          {items.map((item, i) => (
            <CarouselCard
              key={i}
              item={item}
              angleOffset={i * step}
              rotation={rotation}
              radius={radius}
              onSelect={() => handleSelect(item)}
            />
          ))}
        </div>
        <p className="pointer-events-none absolute bottom-0 left-1/2 w-full -translate-x-1/2 text-center text-xs uppercase tracking-[0.3em] text-muted">
          ← swipe · tap to open →
        </p>
      </div>

      {/* Lightbox de la imagen libre */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-70 flex items-center justify-center bg-background/92 p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox}
              alt=""
              initial={{ scale: 0.82, y: 26 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 14 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-h-[86svh] max-w-full rounded-lg border border-accent/40 object-contain shadow-[0_0_60px_rgba(220,20,60,0.35)]"
              draggable={false}
            />
            <button
              aria-label="Close"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-veil bg-background/70 text-xl text-foreground transition hover:border-accent/60"
              onClick={() => setLightbox(null)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CarouselCard({
  item,
  angleOffset,
  rotation,
  radius,
  onSelect,
}: {
  item: ContentItem;
  angleOffset: number;
  rotation: ReturnType<typeof useMotionValue<number>>;
  radius: number;
  onSelect: () => void;
}) {
  // cos(ángulo): 1 = carta al frente, -1 = carta atrás
  const facing = (r: number) =>
    Math.cos((((angleOffset + r) % 360) * Math.PI) / 180);

  const transform = useTransform(rotation, (r) => {
    const a = angleOffset + r;
    const c = facing(r);
    const scale = 0.68 + 0.32 * (c + 1) * 0.5;
    const lift = c > 0 ? -c * 30 : 0; // la frontal se eleva
    return `translate(-50%, -50%) rotateY(${a}deg) translateZ(${radius}px) rotateY(${-a}deg) translateY(${lift}px) scale(${scale})`;
  });
  const opacity = useTransform(rotation, (r) => 0.3 + 0.7 * (facing(r) + 1) * 0.5);
  const zIndex = useTransform(rotation, (r) => Math.round(facing(r) * 100));
  // profundidad: las cartas traseras se oscurecen con un velo (opacity, barato)
  const veilOpacity = useTransform(rotation, (r) =>
    Math.min(0.55, Math.max(0, (1 - facing(r)) * 0.32))
  );
  // glow de la frontal: capa con opacidad animada, no box-shadow dinámico
  const glowOpacity = useTransform(rotation, (r) => Math.max(0, facing(r)));

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 cursor-pointer overflow-hidden rounded-xl shadow-[0_18px_50px_rgba(0,0,0,0.65),0_0_30px_rgba(220,20,60,0.16)]"
      onClick={onSelect}
      style={{
        width: "min(52vw, 230px)",
        aspectRatio: "3 / 4",
        transform,
        opacity,
        zIndex,
        background: item.placeholder,
        willChange: "transform, opacity",
      }}
    >
      {item.image && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={item.image}
          alt=""
          draggable={false}
          className={`h-full w-full object-cover ${
            item.locked ? "scale-110 blur-md brightness-[0.55] saturate-[0.7]" : ""
          }`}
        />
      )}
      {item.locked ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-t from-background/80 via-background/25 to-transparent">
          <span className="box-glow flex h-12 w-12 items-center justify-center rounded-full border border-accent/60 bg-background/85 text-xl">
            🔒
          </span>
          <span className="text-sm font-semibold tracking-widest uppercase">
            Locked
          </span>
          <span className="text-[11px] text-foreground/70">
            Unlock it on my OF
          </span>
        </div>
      ) : (
        <span className="absolute bottom-2 left-2 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold tracking-wide">
          Free
        </span>
      )}
      {/* velo de profundidad (cartas traseras) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-background"
        style={{ opacity: veilOpacity }}
      />
      {/* glow carmesí difuso de la carta frontal (sin línea de borde) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          opacity: glowOpacity,
          boxShadow:
            "0 0 42px rgba(220,20,60,0.4), inset 0 -20px 30px -18px rgba(220,20,60,0.25)",
        }}
      />
    </motion.div>
  );
}
