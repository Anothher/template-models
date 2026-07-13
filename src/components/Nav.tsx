import Link from "next/link";

export default function Nav() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-veil bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-center px-5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-blackletter neon-flicker text-3xl text-accent">
            Luneel
          </span>
          <span className="text-xs uppercase tracking-[0.4em] text-muted">
            Agency
          </span>
        </Link>
      </nav>
    </header>
  );
}
