import { MetadataRoute } from "next";
import { constants } from "@lib/constants";

const version = "1.0";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: constants.app.name,
    short_name: "CX",
    description: "UK AI & Blockchain Digital Agency",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico?v=" + version,
        sizes: "16x16",
        type: "image/x-icon",
      },
      {
        src: "/favicon.svg?v=" + version,
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon1.png?v=" + version,
        sizes: "32x32",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon2.png?v=" + version,
        sizes: "48x48",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon3.png?v=" + version,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon4.png?v=" + version,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
