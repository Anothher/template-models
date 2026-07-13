"use client";

import Link from "next/link";
import { motion } from "framer-motion";

function WaveLine() {
  const wavePath =
    "M0 8 Q 37.5 0, 75 8 T 150 8 T 225 8 T 300 8 T 375 8 T 450 8 T 525 8 T 600 8";
  return (
    <div aria-hidden className="wave-line">
      <div className="wave-track">
        {[0, 1].map((half) => (
          <svg
            key={half}
            viewBox="0 0 600 16"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d={wavePath}
              stroke="rgba(220,20,60,0.85)"
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden text-center text-sm text-muted">
      <WaveLine />
      <motion.div
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="px-5 py-10"
      >
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
          className="mx-auto mb-6 w-fit text-2xl text-accent"
        >
          ✠
        </motion.div>
        <p className="mb-2 italic">
          Todas las personas que aparecen tienen 18 años o más.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="#" className="underline underline-offset-4 transition hover:text-foreground">
            Privacidad
          </Link>
          <span aria-hidden>·</span>
          <Link href="#" className="underline underline-offset-4 transition hover:text-foreground">
            Términos
          </Link>
          <span aria-hidden>·</span>
          <Link href="#" className="underline underline-offset-4 transition hover:text-foreground">
            Contacto
          </Link>
        </div>
        <p className="mt-6 text-xs opacity-60">
          Luneel Agency — {new Date().getFullYear()}
        </p>
      </motion.div>
    </footer>
  );
}
