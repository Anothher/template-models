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
import HeroVideo from "@/components/HeroVideo";

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

      {/* HERO: video con luz ambiental */}
      <section ref={heroRef} className="relative pt-16">
        <Embers count={16} />
        <div className="gsap-hero-fade relative mx-auto w-full max-w-md">
          <HeroVideo
            src={creator.video ?? ""}
            poster={creator.avatar}
          >
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
          </HeroVideo>
        </div>
      </section>

      {/* CARRUSEL 3D */}
      <section className="relative mx-auto w-full max-w-3xl px-2 pb-20 pt-4 sm:px-5">
        <Fog />
        <Carousel3D items={creator.content} ofUrl={creator.ofUrl} />
      </section>

      {/* CTA fija inferior → OnlyFans */}
      <div className="fixed bottom-0 left-0 z-40 w-full border-t border-veil bg-background/85 px-5 py-4 shadow-[0_-8px_32px_rgba(220,20,60,0.12)] backdrop-blur-md">
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
