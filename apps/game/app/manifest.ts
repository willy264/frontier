import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "FRONTIER", short_name: "Frontier", description: "Trade and sail across the FRONTIER archipelago on NEAR testnet.", start_url: "/", display: "standalone", background_color: "#091d29", theme_color: "#e9b75e", icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png" }] };
}
