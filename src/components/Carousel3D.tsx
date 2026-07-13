"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ContentItem } from "@/lib/creators";

/**
 * Galería con scroll nativo + snap al centro: el navegador compone el
 * desplazamiento por hardware (igual que un feed), así que es fluida en
 * cualquier teléfono. La carta centrada se eleva con glow; las laterales
 * se atenúan. Tap en carta libre → lightbox; en bloqueada → OF.
 *
 * El único JS por scroll es un rAF que ajusta scale/opacity de 7 elementos
 * (transformaciones 2D, costo mínimo). Auto-avanza y se pausa al tocar.
 */
export default function Carousel3D({
  items,
  ofUrl,
}: {
  items: ContentItem[];
  ofUrl: string;
}) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const glowEls = useRef<(HTMLDivElement | null)[]>([]);
  const rafPending = useRef(false);
  const lastInteraction = useRef(0);
  const activeIndex = useRef(0);

  // atenúa/escala según distancia al centro — solo cuando hay scroll
  const paint = useCallback(() => {
    rafPending.current = false;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < cardEls.current.length; i++) {
      const card = cardEls.current[i];
      if (!card) continue;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - center);
      const t = Math.min(1, dist / (card.offsetWidth * 1.15)); // 0 centro → 1 lejos
      card.style.transform = `translateY(${t * 10}px) scale(${1 - t * 0.1})`;
      card.style.opacity = String(1 - t * 0.45);
      const glow = glowEls.current[i];
      if (glow) glow.style.opacity = String(1 - t);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    activeIndex.current = best;
  }, []);

  const requestPaint = useCallback(() => {
    if (!rafPending.current) {
      rafPending.current = true;
      requestAnimationFrame(paint);
    }
  }, [paint]);

  useEffect(() => {
    requestPaint();
    window.addEventListener("resize", requestPaint);
    return () => window.removeEventListener("resize", requestPaint);
  }, [requestPaint]);

  // auto-avance suave; se pausa unos segundos si el usuario interactúa
  useEffect(() => {
    const id = window.setInterval(() => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      if (Date.now() - lastInteraction.current < 5000) return;
      const next = (activeIndex.current + 1) % cardEls.current.length;
      const card = cardEls.current[next];
      if (!card) return;
      scroller.scrollTo({
        left: card.offsetLeft + card.offsetWidth / 2 - scroller.clientWidth / 2,
        behavior: "smooth",
      });
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  // cualquier gesto sobre la galería pausa el auto-avance unos segundos
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const mark = () => {
      lastInteraction.current = Date.now();
    };
    const opts: AddEventListenerOptions = { passive: true };
    scroller.addEventListener("pointerdown", mark, opts);
    scroller.addEventListener("wheel", mark, opts);
    scroller.addEventListener("touchstart", mark, opts);
    return () => {
      scroller.removeEventListener("pointerdown", mark);
      scroller.removeEventListener("wheel", mark);
      scroller.removeEventListener("touchstart", mark);
    };
  }, []);

  const handleSelect = (item: ContentItem, index: number) => {
    // tocar una carta lateral solo la centra; la acción es sobre la central
    if (index !== activeIndex.current) {
      const scroller = scrollerRef.current;
      const card = cardEls.current[index];
      if (scroller && card) {
        scroller.scrollTo({
          left: card.offsetLeft + card.offsetWidth / 2 - scroller.clientWidth / 2,
          behavior: "smooth",
        });
      }
      return;
    }
    if (item.locked) {
      window.open(ofUrl, "_blank", "noopener,noreferrer");
    } else if (item.image) {
      setLightbox(item.image);
    }
  };

  return (
    <>
      <div className="relative" data-no-smoke>
        {/* escenario: foco de luz tras las cartas */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 h-[135%] w-[150%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(ellipse 52% 46% at 50% 46%, rgba(220,20,60,0.08), rgba(88,28,135,0.05) 48%, transparent 72%)",
            }}
          />
          <div
            className="absolute bottom-6 left-1/2 h-8 w-1/2 -translate-x-1/2 rounded-[100%]"
            style={{
              background:
                "radial-gradient(ellipse, rgba(220,20,60,0.2), transparent 70%)",
              filter: "blur(14px)",
            }}
          />
        </div>

        <div
          ref={scrollerRef}
          onScroll={requestPaint}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto py-8"
          style={{
            paddingInline: "calc(50% - min(31vw, 120px))",
            scrollBehavior: "smooth",
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              ref={(el) => {
                cardEls.current[i] = el;
              }}
              onClick={() => handleSelect(item, i)}
              className="relative shrink-0 cursor-pointer snap-center overflow-hidden rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
              style={{
                width: "min(62vw, 240px)",
                aspectRatio: "3 / 4",
                background: item.placeholder,
                willChange: "transform, opacity",
                transition: "box-shadow 0.3s ease",
              }}
            >
              {item.image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={item.image}
                  alt=""
                  draggable={false}
                  loading={i < 3 ? "eager" : "lazy"}
                  className={`h-full w-full object-cover ${
                    item.locked
                      ? "scale-110 blur-md brightness-[0.55] saturate-[0.7]"
                      : ""
                  }`}
                />
              )}
              {item.locked ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-linear-to-t from-background/80 via-background/25 to-transparent">
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
              {/* glow carmesí de la carta centrada */}
              <div
                aria-hidden
                ref={(el) => {
                  glowEls.current[i] = el;
                }}
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                  opacity: 0,
                  boxShadow:
                    "0 0 42px rgba(220,20,60,0.4), inset 0 -20px 30px -18px rgba(220,20,60,0.25)",
                }}
              />
            </div>
          ))}
        </div>

        <p className="pointer-events-none mt-1 w-full text-center text-xs uppercase tracking-[0.3em] text-muted">
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
