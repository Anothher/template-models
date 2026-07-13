"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Video del hero con "ambilight": un canvas de baja resolución muestrea el
 * fotograma actual y, desenfocado detrás del video, proyecta su luz sobre la
 * página — el fondo respira con los colores del video en tiempo real.
 * El sampleo es a ~5 fps sobre 24×44 px: costo casi nulo, efecto enorme.
 */
export default function HeroVideo({
  src,
  poster,
  children,
}: {
  src: string;
  poster?: string;
  children?: ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let timer: number;
    const draw = () => {
      if (video.readyState >= 2 && !video.paused) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      timer = window.setTimeout(draw, 200);
    };
    draw();
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* luz ambiental estilo YouTube: ancho completo de pantalla, misma
          altura del video; el fotograma desenfocado baña toda la franja */}
      <canvas
        ref={canvasRef}
        width={32}
        height={44}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[125%] w-screen -translate-x-1/2 opacity-50"
        style={{
          filter: "blur(75px) saturate(1.15)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 42%, rgba(0,0,0,0.2) 66%, transparent 84%)",
          maskImage:
            "linear-gradient(to bottom, black 42%, rgba(0,0,0,0.2) 66%, transparent 84%)",
        }}
      />
      <div
        className="relative overflow-hidden"
        style={{
          // disolución radial desde arriba: las esquinas inferiores se funden
          // antes que el centro — ninguna línea recta que el ojo pueda seguir
          WebkitMaskImage:
            "radial-gradient(130% 105% at 50% 0%, black 55%, rgba(0,0,0,0.55) 74%, transparent 96%)",
          maskImage:
            "radial-gradient(130% 105% at 50% 0%, black 55%, rgba(0,0,0,0.55) 74%, transparent 96%)",
        }}
      >
        <div className="gsap-photo">
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="max-h-[46svh] min-h-60 w-full object-cover object-top"
          />
        </div>
        {/* sombra suave solo arriba, para que el nav se lea bien */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(7,5,9,0.4), transparent 28%)",
          }}
        />
        {/* contenido superpuesto (nombre, estado) */}
        <div className="absolute inset-x-0 bottom-3 z-10 px-5 text-center">
          {children}
        </div>
      </div>
    </div>
  );
}
