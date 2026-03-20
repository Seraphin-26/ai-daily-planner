/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["framer-motion"],

  // Active le mode standalone pour Docker
  // Génère un dossier .next/standalone avec uniquement les fichiers nécessaires
  // Réduit la taille de l'image de ~1GB à ~200MB
  output: "standalone",
};

export default nextConfig;