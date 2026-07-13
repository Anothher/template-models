"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "luneel-age-verified";

/**
 * Modal de verificación de edad. Aparece en cada visita nueva (se recuerda
 * solo durante la sesión de la pestaña: sessionStorage). "No" saca del sitio.
 */
export default function AgeGate() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) !== "1") setOpen(true);
  }, []);

  // bloquea el scroll de fondo mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const accept = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const reject = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-80 flex items-center justify-center bg-background/90 px-5 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="agegate-title"
        >
          <motion.div
            initial={{ scale: 0.86, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="card-gothic w-full max-w-sm p-8 text-center"
          >
            <h2
              id="agegate-title"
              className="font-blackletter neon-flicker text-5xl text-foreground"
            >
              +18
            </h2>
            <p className="mt-3 font-blackletter text-2xl text-accent-soft">
              Solo para adultos
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Este sitio contiene contenido para mayores de edad. Confirma que
              tienes 18 años o más para continuar.
            </p>
            <div className="mt-7 flex flex-col gap-3">
              <button onClick={accept} className="btn-blood w-full px-6 py-3.5">
                Soy mayor de 18 · Entrar
              </button>
              <button onClick={reject} className="btn-ghost w-full px-6 py-3">
                No, salir
              </button>
            </div>
            <p className="mt-5 text-xs text-muted/70">
              Al entrar aceptas los términos y la política de privacidad.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
