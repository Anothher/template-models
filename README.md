# template-models

Sitio de perfil dark/gótico para modelos/creadores, construido con Next.js (App Router + TypeScript + Tailwind v4) y framer-motion.

## Características

- **Perfil directo en `/`**: foto hero con parallax, nombre en blackletter revelado letra por letra, copy de venta y CTA fija que redirige al OnlyFans del modelo.
- **Carrusel 3D**: las cartas orbitan con perspectiva; la frontal se eleva con glow, las bloqueadas muestran la foto con blur. Gira solo y se puede arrastrar (mouse o dedo) con inercia.
- **Efectos**: humo carmesí siguiendo el cursor/dedo, brasas ascendentes, niebla animada, contadores de estadísticas y footer con cinta blackletter infinita.
- **Mobile-first y full responsive.**

## Desarrollo

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

## Personalizar

- **Foto principal**: reemplaza `public/fitprince.jpg` con la foto real (mismo nombre) y todo el sitio la toma.
- **Datos del modelo** (nombre, bio, tagline, stats, enlace de OnlyFans): [src/lib/creators.ts](src/lib/creators.ts). Cada entrada genera su ruta `/m/[slug]`.
- **Tokens de diseño** (colores, glow, animaciones, marquee): [src/app/globals.css](src/app/globals.css).
- **Tipografías**: [src/app/layout.tsx](src/app/layout.tsx).
