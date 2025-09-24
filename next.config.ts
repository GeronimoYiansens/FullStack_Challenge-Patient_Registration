import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    '@sequelize/core',
    '@sequelize/postgres'
  ]
};

export default nextConfig;
