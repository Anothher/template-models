import Link from "next/link";

export default function Nav() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-veil bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-center px-5">
        <Link href="/" className="font-blackletter neon-flicker text-3xl text-accent">
          FitPrince
        </Link>
      </nav>
    </header>
  );
}
