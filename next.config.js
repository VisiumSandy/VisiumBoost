/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow images from any domain (for logos)
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  // Required for subdomain middleware to work on Vercel
  // The wildcard domain *.zreview.fr must be added in Vercel project settings → Domains
};

module.exports = nextConfig;
