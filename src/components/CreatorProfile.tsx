"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Creator } from "@/lib/creators";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Embers from "@/components/Embers";
import Fog from "@/components/Fog";
import Reveal from "@/components/Reveal";
import LetterReveal from "@/components/LetterReveal";
import Carousel3D from "@/components/Carousel3D";
import SmokeCursor from "@/components/SmokeCursor";
import Marquee from "@/components/Marquee";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function CreatorProfile({ creator }: { creator: Creator }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // parallax del hero: scrub numérico = la animación persigue el scroll
      // con ~1s de inercia en vez de ir clavada al dedo (se siente fluido)
      gsap.to(".gsap-photo", {
        yPercent: 10,
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.to(".gsap-hero-fade", {
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative flex min-h-screen flex-col overflow-x-clip">
      <SmokeCursor />
      <Nav />

      {/* HERO: foto + copy combinados, compacto */}
      <section ref={heroRef} className="relative pt-16">
        <Embers count={16} />
        <div className="gsap-hero-fade relative mx-auto w-full max-w-md">
          <div className="relative overflow-hidden">
            <div className="gsap-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={creator.avatar ?? creator.content[0].image}
                alt={creator.name}
                draggable={false}
                loading="eager"
                fetchPriority="high"
                className="max-h-[36svh] min-h-60 w-full object-cover object-top"
              />
            </div>
            {/* funde la foto con el fondo */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, var(--background) 4%, rgba(7,5,9,0.55) 26%, rgba(7,5,9,0.08) 55%, rgba(7,5,9,0.25) 100%)",
              }}
            />
            {/* nombre sobre la foto */}
            <div className="absolute inset-x-0 bottom-3 z-10 px-5 text-center">
              <h1 className="font-blackletter neon-flicker-slow text-6xl leading-none text-foreground sm:text-7xl">
                <LetterReveal text={creator.name} delay={0.1} />
              </h1>
              <Reveal delay={0.3}>
                <p className="mt-1 flex items-center justify-center gap-3 text-sm">
                  <span className="text-muted">{creator.handle}</span>
                  {creator.online && (
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="breathe inline-block h-2 w-2 rounded-full bg-emerald-400" />
                      Activo ahora
                    </span>
                  )}
                </p>
              </Reveal>
            </div>
          </div>

        </div>
      </section>

      {/* Cinta blackletter inclinada */}
      <Marquee />

      {/* CARRUSEL 3D */}
      <section className="relative mx-auto w-full max-w-3xl px-2 pb-20 pt-4 sm:px-5">
        <Fog />
        <Carousel3D items={creator.content} ofUrl={creator.ofUrl} />
      </section>

      {/* DESCRIPCIÓN — al cierre, después de que el contenido ya vendió */}
      <section className="relative mx-auto w-full max-w-md px-6 pb-24 text-center">
        <Reveal>
          <p className="ornament mx-auto mb-8 max-w-xs text-base">❦</p>
          <p className="font-blackletter text-2xl text-accent-soft text-glow sm:text-3xl">
            {creator.tagline}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-3 italic leading-relaxed text-foreground/85">
            {creator.bio}
          </p>
        </Reveal>
      </section>

      {/* CTA fija inferior → OnlyFans */}
      <div className="fixed bottom-0 left-0 z-40 w-full border-t border-veil bg-background/85 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-md">
          <a
            href={creator.ofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-blood pulse-ring flex w-full px-8 py-4 text-base"
          >
            Ver todo el contenido →
          </a>
        </div>
      </div>

      <div className="pb-32">
        <Footer />
      </div>
    </div>
  );
}
