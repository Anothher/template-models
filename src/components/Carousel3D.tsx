"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ContentItem } from "@/lib/creators";

/**
 * Galería con scroll nativo + snap al centro, en bucle infinito: las cartas
 * se renderizan por triplicado y, al acercarse a un extremo, el scroll salta
 * en silencio exactamente un "set" — como el contenido se repite, el salto es
 * invisible. El navegador compone el desplazamiento por hardware (fluido en
 * cualquier teléfono). Tap en carta libre → lightbox; en bloqueada → OF.
 */
export default function Carousel3D({
  items,
  ofUrl,
}: {
  items: ContentItem[];
  ofUrl: string;
}) {
  const N = items.length;
  const looped = [...items, ...items, ...items];

  const [lightbox, setLightbox] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const glowEls = useRef<(HTMLDivElement | null)[]>([]);
  const rafPending = useRef(false);
  const lastInteraction = useRef(0);
  const activeIndex = useRef(N);
  const markRef = useRef<() => void>(() => {});

  // atenúa/escala según distancia al centro y teletransporta en los bordes
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

    // bucle infinito: si salimos del set central, saltamos un set completo
    const firstMid = cardEls.current[N];
    const firstStart = cardEls.current[0];
    if (firstMid && firstStart && (best < N || best >= 2 * N)) {
      const setWidth = firstMid.offsetLeft - firstStart.offsetLeft;
      const delta = best < N ? setWidth : -setWidth;
      scroller.scrollTo({
        left: scroller.scrollLeft + delta,
        behavior: "instant",
      });
      activeIndex.current = best + (best < N ? N : -N);
    } else {
      activeIndex.current = best;
    }
  }, [N]);

  const requestPaint = useCallback(() => {
    if (!rafPending.current) {
      rafPending.current = true;
      requestAnimationFrame(paint);
    }
  }, [paint]);

  const centerOn = useCallback((index: number, smooth = true) => {
    const scroller = scrollerRef.current;
    const card = cardEls.current[index];
    if (!scroller || !card) return;
    scroller.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - scroller.clientWidth / 2,
      behavior: smooth ? "smooth" : "instant",
    });
  }, []);

  // arranca centrado en el set del medio
  useEffect(() => {
    centerOn(N, false);
    requestPaint();
    window.addEventListener("resize", requestPaint);
    return () => window.removeEventListener("resize", requestPaint);
  }, [N, centerOn, requestPaint]);

  // cualquier gesto sobre la galería pausa el auto-avance unos segundos
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const mark = () => {
      lastInteraction.current = Date.now();
    };
    markRef.current = mark;
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

  // auto-avance suave; se pausa unos segundos si el usuario interactúa
  useEffect(() => {
    const id = window.setInterval(() => {
      if (Date.now() - lastInteraction.current < 5000) return;
      centerOn(activeIndex.current + 1);
    }, 4000);
    return () => window.clearInterval(id);
  }, [centerOn]);

  const handleArrow = (dir: -1 | 1) => {
    markRef.current();
    centerOn(activeIndex.current + dir);
  };

  const handleSelect = (item: ContentItem, index: number) => {
    // tocar una carta lateral solo la centra; la acción es sobre la central
    if (index !== activeIndex.current) {
      markRef.current();
      centerOn(index);
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
          {looped.map((item, i) => (
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
              }}
            >
              {item.image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={item.image}
                  alt=""
                  draggable={false}
                  loading={i >= N && i < N + 3 ? "eager" : "lazy"}
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

        {/* flechas sutiles */}
        <button
          aria-label="Previous"
          onClick={() => handleArrow(-1)}
          className="absolute left-1 top-1/2 z-10 flex h-12 w-9 -translate-y-1/2 items-center justify-center text-3xl text-foreground/25 transition-colors duration-300 hover:text-accent-soft/80 active:text-accent-soft sm:left-3"
        >
          ‹
        </button>
        <button
          aria-label="Next"
          onClick={() => handleArrow(1)}
          className="absolute right-1 top-1/2 z-10 flex h-12 w-9 -translate-y-1/2 items-center justify-center text-3xl text-foreground/25 transition-colors duration-300 hover:text-accent-soft/80 active:text-accent-soft sm:right-3"
        >
          ›
        </button>

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
