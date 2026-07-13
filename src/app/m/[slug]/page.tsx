import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CreatorProfile from "@/components/CreatorProfile";
import { creators, getCreator } from "@/lib/creators";

export function generateStaticParams() {
  return creators.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const creator = getCreator((await params).slug);
  return {
    title: creator ? `${creator.name} — Contenido exclusivo` : "Contenido exclusivo",
  };
}

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const creator = getCreator((await params).slug);
  if (!creator) notFound();
  return <CreatorProfile creator={creator} />;
}
