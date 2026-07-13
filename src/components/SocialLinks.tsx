"use client";

import { motion } from "framer-motion";
import type { Creator } from "@/lib/creators";
import StatCounter, { abbreviate } from "@/components/StatCounter";

const ICONS: Record<string, { label: string; path: string }> = {
  x: {
    label: "X",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z",
  },
  instagram: {
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z",
  },
  tiktok: {
    label: "TikTok",
    path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z",
  },
};

/** Iconos de redes con seguidores debajo, glow gótico y entrada escalonada. */
export default function SocialLinks({
  socials,
  className = "",
}: {
  socials: Creator["socials"];
  className?: string;
}) {
  const entries = Object.entries(socials).filter(([, p]) => p?.url) as [
    keyof typeof ICONS,
    { url: string; followers: number },
  ][];
  if (entries.length === 0) return null;

  return (
    <div className={`flex items-start justify-center gap-5 ${className}`}>
      {entries.map(([key, profile], i) => (
        <motion.a
          key={key}
          href={profile.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${ICONS[key].label} — ${abbreviate(profile.followers)} seguidores`}
          initial={{ opacity: 0, y: 18, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 1.05 + i * 0.12,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          whileHover={{ y: -3, scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="group flex flex-col items-center gap-1.5"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-veil bg-background/60 text-foreground/80 backdrop-blur-sm transition-[border-color,box-shadow,color] duration-300 group-hover:border-accent/60 group-hover:text-foreground group-hover:shadow-[0_0_18px_rgba(220,20,60,0.35)]">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
              <path d={ICONS[key].path} />
            </svg>
          </span>
          <span className="text-xs font-semibold tracking-wide text-muted transition-colors group-hover:text-accent-soft">
            <StatCounter value={profile.followers} formatter={abbreviate} />
          </span>
        </motion.a>
      ))}
    </div>
  );
}
