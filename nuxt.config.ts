// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: "Kora | Web",
      meta: [
        { name: "description", content: "System" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "robots", content: "noindex, nofollow" },
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
  css: ["~/assets/css/main.css"],

  icon: {
    provider: "iconify",
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || "",
      apiTimeout: process.env.NUXT_PUBLIC_API_TIMEOUT || "",
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
});
