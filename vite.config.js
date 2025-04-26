// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import fs from "fs";

export default defineConfig({
  base: "/booknest/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        // zusätzliche Dateien, die immer gecached werden
        "favicon.svg",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "BookNest",
        short_name: "BookNest",
        description: "Dein persönliches Bücher-Nest – immer griffbereit",
        theme_color: "#ffffff",
        background_color: "#f3f4f6",
        display: "standalone",
        start_url: "/booknest/",
        scope: "/booknest/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        // hier kannst du Caching-Strategien anpassen
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-stylesheets",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["@undecaf/zbar-wasm"],
  },
  build: {
    rollupOptions: {
      external: ["@undecaf/zbar-wasm"],
    },
  },
  assetsInclude: ["**/*.wasm"],
  server: {
    https: {
      key: fs.readFileSync("./certs/localhost+2-key.pem"),
      cert: fs.readFileSync("./certs/localhost+2.pem"),
    },
    host: true, // erlaubt Zugriff via IP-Adresse
    port: 5173,
  },
});
