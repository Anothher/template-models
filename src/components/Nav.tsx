import Link from "next/link";

export default function Nav({ online = false }: { online?: boolean }) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-veil bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-center px-5">
        <Link href="/" className="flex flex-col items-center leading-none">
          <span className="font-blackletter neon-flicker text-3xl text-accent">
            FitPrince
          </span>
          {online && (
            <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-emerald-400">
              <span className="breathe inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online now
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
