/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.imgur.com", "jacky-canchu-api.octave.vip"],
  },
  env: {
    API_URL: "https://jacky-canchu-api.octave.vip/api/",
    API_VERSION: "1.0",
  },
};

module.exports = nextConfig;
