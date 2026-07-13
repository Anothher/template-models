const marqueeItems = [
  "FitPrince",
  "Contenido exclusivo",
  "Nuevo cada día",
  "Sin bots",
  "@fitprincevip",
];

/** Banda blackletter infinita, ligeramente inclinada, estilo cinta de neón. */
export default function Marquee() {
  return (
    <div className="relative z-20 my-6 -rotate-2 scale-105 border-y border-accent/30 bg-background/80 shadow-[0_0_30px_rgba(220,20,60,0.15)] backdrop-blur-sm">
      <div className="marquee py-3">
        <div className="marquee-track">
          {[0, 1].map((half) => (
            <div
              key={half}
              aria-hidden={half === 1}
              className="flex shrink-0 items-center"
            >
              {marqueeItems.map((item) => (
                <span key={item} className="flex items-center">
                  <span className="font-blackletter text-glow mx-5 text-2xl text-accent/90">
                    {item}
                  </span>
                  <span className="text-sm text-gold">✠</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
