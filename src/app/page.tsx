import CreatorProfile from "@/components/CreatorProfile";
import { getCreator } from "@/lib/creators";

export const metadata = { title: "FitPrince — Exclusive content" };

export default function Home() {
  const creator = getCreator("fitprince");
  if (!creator) throw new Error("Falta el creador 'fitprince' en src/lib/creators.ts");
  return <CreatorProfile creator={creator} />;
}
