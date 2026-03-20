/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow framer-motion and other ESM packages
  transpilePackages: ["framer-motion"],
};

export default nextConfig;
