// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: "Kora | Web",
      meta: [
        { name: "description", content: "Kora wellness and membership" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      htmlAttrs: {
        lang: "en",
      },
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@pinia/nuxt", "@nuxt/eslint"],
  $development: {
    vite: {
      server: {
        allowedHosts: (process.env.NUXT_VITE_ALLOWED_HOSTS || "")
          .split(",")
          .map(host => host.trim())
          .filter(Boolean),
      },
    },
  },
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "light",
    fallback: "light",
    storageKey: "kora-web-color-mode",
  },

  icon: {
    provider: "iconify",
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || "",
      apiTimeout: process.env.NUXT_PUBLIC_API_TIMEOUT || "",
      bookingEnabled: process.env.NUXT_PUBLIC_BOOKING_ENABLED || "false",
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  experimental: {
    viteEnvironmentApi: true,
  },

  nitro: {
    compressPublicAssets: true,
    routeRules: {
      "/images/**": {
        headers: { "cache-control": "public, max-age=31536000, immutable" },
      },
      "/logo/**": {
        headers: { "cache-control": "public, max-age=31536000, immutable" },
      },
    },
  },
});
