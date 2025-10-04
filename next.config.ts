import type { NextConfig } from "next";
import type { Configuration } from "webpack";
import path from "path";

const nextConfig: NextConfig = {
  webpack(config: Configuration) {
    if (config.resolve && typeof config.resolve.alias === "object") {
      (config.resolve.alias as Record<string, string>)["@"] = path.resolve(__dirname, "src");
    }
    return config;
  },
};

export default nextConfig;
