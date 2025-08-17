/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  webpack: (config) => {
    config.externals.push({
      'mysql2': 'commonjs mysql2'
    })
    return config
  }
}

export default nextConfig
