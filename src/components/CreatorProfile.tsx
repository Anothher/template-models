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
import StatCounter, { thousands } from "@/components/StatCounter";
import SmokeCursor from "@/components/SmokeCursor";
import Marquee from "@/components/Marquee";
import SocialLinks from "@/components/SocialLinks";

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

      // el título "Contenido" entra suave (sin blur animado: cuesta GPU)
      gsap.from(".gsap-title", {
        scale: 1.22,
        opacity: 0,
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: ".gsap-title",
          start: "top 98%",
          end: "top 62%",
          scrub: 0.8,
        },
      });

      // tiles de estadísticas: caen con giro 3D escalonado
      gsap.from(".stat-tile", {
        y: 48,
        opacity: 0,
        rotateX: 16,
        transformOrigin: "top center",
        stagger: 0.12,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".stat-grid",
          start: "top 88%",
        },
      });
    },
    { scope: containerRef }
  );

  const totalFollowers = Object.values(creator.socials).reduce(
    (sum, p) => sum + (p?.followers ?? 0),
    0
  );

  const stats = [
    { icon: "📸", value: creator.stats.photos, decimals: 0, label: "Fotos", caption: "+ nuevas a diario" },
    { icon: "🎬", value: creator.stats.videos, decimals: 0, label: "Videos", caption: "en alta calidad" },
    { icon: "★", value: creator.stats.rating, decimals: 1, label: "Rating", caption: "de sus fans" },
  ];

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
                className="max-h-[54svh] min-h-[340px] w-full object-cover object-top"
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
                <LetterReveal text={creator.name} delay={0.25} />
              </h1>
              <Reveal delay={0.75}>
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

          {/* copy vendedor */}
          <div className="relative z-10 px-6 pt-5 text-center">
            <Reveal delay={0.85}>
              <p className="font-blackletter text-2xl text-accent-soft text-glow sm:text-3xl">
                {creator.tagline}
              </p>
            </Reveal>
            <Reveal delay={0.95}>
              <p className="mt-3 italic leading-relaxed text-foreground/85">
                {creator.bio}
              </p>
            </Reveal>
            <SocialLinks socials={creator.socials} className="mt-5 mb-3" />

            {/* Seguidores totales de todas las redes */}
            {totalFollowers > 0 && (
              <Reveal delay={1.35}>
                <div className="mt-6 inline-flex flex-col items-center" style={{ display: "none" }}>
                  <p
                    className="text-4xl font-bold sm:text-5xl"
                    style={{
                      background:
                        "linear-gradient(to bottom, #ece4d6 30%, #ff4d6d)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    <StatCounter value={totalFollowers} formatter={thousands} />
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted">
                    Seguidores totales
                  </p>
                  <span
                    aria-hidden
                    className="mt-3 h-px w-24"
                    style={{
                      background:
                        "linear-gradient(to right, transparent, rgba(220,20,60,0.7), transparent)",
                    }}
                  />
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Cinta blackletter inclinada */}
      <Marquee />

      {/* CARRUSEL 3D */}
      <section className="relative mx-auto w-full max-w-3xl px-2 pb-20 pt-14 sm:px-5">
        <Fog />
        <h2 className="gsap-title font-blackletter text-glow relative z-10 mb-2 text-center text-4xl text-foreground sm:text-5xl">
          Contenido
        </h2>
        <p className="ornament relative z-10 mx-auto mb-10 max-w-xs text-base">❦</p>
        <Carousel3D items={creator.content} ofUrl={creator.ofUrl} />
      </section>

      {/* ESTADÍSTICAS */}
      <section className="relative mx-auto w-full max-w-md px-5 pb-24">
        <div className="stat-grid grid grid-cols-3 gap-2.5 [perspective:900px] sm:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="stat-tile card-gothic relative overflow-hidden px-2 py-6 text-center"
            >
              {/* filo superior encendido */}
              <span
                aria-hidden
                className="absolute inset-x-4 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(220,20,60,0.8), transparent)",
                }}
              />
              <span
                aria-hidden
                className="box-glow mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 bg-background/60 text-lg"
              >
                {s.icon}
              </span>
              <p
                className="text-3xl font-bold sm:text-4xl"
                style={{
                  background: "linear-gradient(to bottom, #ece4d6 30%, #ff4d6d)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                <StatCounter value={s.value} decimals={s.decimals} />
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-foreground/90">
                {s.label}
              </p>
              <p className="mt-1 text-[11px] italic text-muted">{s.caption}</p>
            </div>
          ))}
        </div>
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
