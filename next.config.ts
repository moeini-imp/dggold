import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating dev indicator badge in the corner.
  devIndicators: false,
  // Self-contained server bundle for the Docker image.
  output: "standalone",
};

export default nextConfig;
