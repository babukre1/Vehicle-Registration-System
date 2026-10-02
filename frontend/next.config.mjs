/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const backend = process.env.BACKEND_ORIGIN || "https://vehicle-registration-system-backend.vercel.app"
    return [{ source: "/api/:path*", destination: `${backend}/api/:path*` }]
  },
}

export default nextConfig
