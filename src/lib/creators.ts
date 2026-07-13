export type ContentItem = {
  locked: boolean;
  /** Imagen real (ruta en /public). Si no hay, se usa el gradiente placeholder. */
  image?: string;
  /** Gradiente CSS usado como placeholder del contenido. */
  placeholder: string;
};

export type SocialProfile = { url: string; followers: number };

export type Creator = {
  slug: string;
  name: string;
  handle: string;
  online: boolean;
  tagline: string;
  bio: string;
  avatar?: string;
  /** Video del hero (ruta en /public). Si existe, reemplaza a la foto. */
  video?: string;
  /** Enlace externo al que redirige el botón principal. */
  ofUrl: string;
  /**
   * Redes sociales con sus seguidores (actualiza el número a mano por ahora;
   * más adelante se puede conectar a los APIs oficiales de TikTok/Instagram).
   */
  socials: {
    tiktok?: SocialProfile;
    instagram?: SocialProfile;
    x?: SocialProfile;
  };
  stats: { photos: number; videos: number; rating: number };
  content: ContentItem[];
};

/**
 * Perfiles del sitio. La foto principal vive en /public/recursos/fitprince.jpeg —
 * reemplaza ese archivo con la foto real y todo el sitio la toma.
 */
export const creators: Creator[] = [
  {
    slug: "fitprince",
    name: "FitPrince",
    handle: "@fitprincevip",
    online: true,
    tagline: "El contenido que tu feed no se atreve a mostrarte.",
    bio: "Fotos y videos exclusivos todos los días — sin censura, sin bots. Cada mensaje lo respondo yo. Lo que ves aquí es solo la puerta: lo mejor está adentro. 👑",
    avatar: "/recursos/fitprince.jpeg",
    video: "/recursos/fitprinceVideo.mp4",
    ofUrl: "https://onlyfans.com/fitprincevip",
    socials: {
      tiktok: { url: "https://tiktok.com/@littlesix.9", followers: 130300 },
      instagram: { url: "https://instagram.com/littlesix.9", followers: 69000 },
      x: { url: "https://x.com/littlesix9_", followers: 50500 },
    },
    stats: { photos: 842, videos: 136, rating: 4.9 },
    content: [
      {
        locked: false,
        image: "/recursos/fitprince.jpeg",
        placeholder:
          "radial-gradient(120% 120% at 20% 10%, #3b0d1c 0%, #12060c 55%, #070509 100%)",
      },
      {
        locked: false,
        image: "/recursos/photo_1.jpg",
        placeholder:
          "radial-gradient(120% 120% at 80% 20%, #241033 0%, #0e0716 60%, #070509 100%)",
      },
      {
        locked: false,
        image: "/recursos/photo_2.jpg",
        placeholder:
          "radial-gradient(120% 120% at 30% 80%, #33101a 0%, #100710 60%, #070509 100%)",
      },
      {
        locked: false,
        image: "/recursos/photo_3.jpg",
        placeholder:
          "radial-gradient(120% 120% at 70% 70%, #1b0f2e 0%, #0c0712 60%, #070509 100%)",
      },
      {
        locked: false,
        image: "/recursos/photo_4.jpg",
        placeholder:
          "radial-gradient(120% 120% at 50% 30%, #2c0f14 0%, #0f0810 60%, #070509 100%)",
      },
      {
        locked: false,
        image: "/recursos/photo_5.jpg",
        placeholder:
          "radial-gradient(120% 120% at 40% 60%, #1f1130 0%, #0d0713 60%, #070509 100%)",
      },
      {
        locked: false,
        image: "/recursos/photo_6.jpg",
        placeholder:
          "radial-gradient(120% 120% at 40% 60%, #1f1130 0%, #0d0713 60%, #070509 100%)",
      },
    ],
  },
];

export function getCreator(slug: string): Creator | undefined {
  return creators.find((c) => c.slug === slug);
}
