import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

// ID unik per build, ditulis oleh scripts/write-deploy-id.mjs (script
// "prebuild"). Dibaca dari file -- bukan dihitung di sini -- supaya nilainya
// identik saat `next build` dan saat `next start` (config dievaluasi ulang di
// kedua proses). Kalau file tidak ada (mis. `next dev`), fitur dimatikan.
const deployIdFile = join(process.cwd(), ".deploy-id");
const deploymentId = existsSync(deployIdFile)
  ? readFileSync(deployIdFile, "utf8").trim() || undefined
  : undefined;

const nextConfig: NextConfig = {
  /* config options here */
  deploymentId,
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
