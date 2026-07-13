import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // permite probar el dev server desde el teléfono en la red local
  allowedDevOrigins: ["192.168.1.25"],
};

export default nextConfig;
