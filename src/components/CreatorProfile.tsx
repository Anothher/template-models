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
      <Nav online={creator.online} />

      {/* HERO: video con luz ambiental */}
      <section ref={heroRef} className="enter-rise relative pt-16">
        <Embers count={16} />
        <div className="gsap-hero-fade relative mx-auto w-full max-w-md">
          <HeroVideo src={creator.video ?? ""} poster={creator.avatar} />
        </div>
      </section>

      {/* CARRUSEL — solapado con la caída del video para luz continua */}
      <section className="enter-rise relative mx-auto -mt-10 w-full max-w-3xl px-2 pb-20 pt-2 [animation-delay:0.18s] sm:px-5">
        <Fog />
        <Carousel3D items={creator.content} ofUrl={creator.ofUrl} />
      </section>

      {/* CTA fija inferior → OnlyFans */}
      <div className="enter-rise fixed bottom-0 left-0 z-40 w-full border-t border-veil bg-background/85 px-5 py-4 shadow-[0_-8px_32px_rgba(220,20,60,0.12)] backdrop-blur-md [animation-delay:0.35s]">
        <div className="mx-auto max-w-md">
          <a
            href={creator.ofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-blood pulse-ring flex w-full px-8 py-4 text-base"
          >
            See all my content →
          </a>
        </div>
      </div>

      <div className="pb-32">
        <Footer />
      </div>
    </div>
  );
}
