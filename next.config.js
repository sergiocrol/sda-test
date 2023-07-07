/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.stablediffusionapi.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
