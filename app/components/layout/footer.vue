<script setup lang="ts">
const navColumns = [
  {
    title: "Spaces",
    links: [
      { label: "NUTRITION", to: "/nutrition" },
      { label: "RECOVERY", to: "/recovery" },
      { label: "WELLNESS", to: "/wellness" },
    ],
  },
  {
    title: "Navigate",
    links: [
      { label: "SESSIONS", to: "/session?tab=all" },
      { label: "SPA SANCTUARY", to: "/spa" },
      { label: "MEMBERSHIP", to: "/membership" },
      { label: "SCHEDULE", to: "/schedules" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "CAREERS", to: "/careers" },
      { label: "FEEDBACK & INQUIRY", to: "/inquire" },
      { label: "KORA ETIQUETTE", to: "/etiquette" },
      { label: "CSR", to: "/csr" },
      { label: "TERMS & POLICY", to: "/policy" },
    ],
  },
];

const contacts = [
  { label: "Email", value: "info@koranepal.com", href: "mailto:info@koranepal.com" },
  { label: "Phone", value: "01-4785467, 9845787654" },
  { label: "Address", value: "Hattisar, Kathmandu, Nepal" },
];

const socials = [
  {
    icon: "i-lucide-instagram",
    href: "https://www.instagram.com/lifeatkora",
    title: "Instagram",
  },
];
</script>

<template>
  <footer
    class="font-sans bg-[#111112] text-foreground border-t border-border transition-colors duration-300"
  >
    <!-- Grid Links -->
    <div class="max-w-400 mx-auto px-4 md:px-8 lg:px-12 py-16">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-10 lg:gap-8"
      >
        <!-- Brand -->
        <div class="lg:col-span-4 flex flex-col gap-6">
          <NuxtLink
            to="/"
            class="flex items-center gap-3 w-fit focus:outline-none"
          >
            <img
              src="/logo/kora_white_logo.svg"
              alt="KORA Logo"
              class="w-12 h-12 md:w-32 md:h-8 object-contain"
            >
          </NuxtLink>
          <p class="text-secondary-foreground text-sm leading-relaxed max-w-70">
            The bridge between the chaos of the city and the clarity of the
            self.
          </p>
        </div>

        <!-- Nav Columns -->
        <div
          v-for="col in navColumns"
          :key="col.title"
          class="lg:col-span-2 flex flex-col gap-4"
        >
          <h4
            class="text-secondary-foreground text-xs md:text-sm font-semibold tracking-widest uppercase"
          >
            {{ col.title }}
          </h4>
          <ul
            class="flex flex-col gap-3 text-xs md:text-sm text-muted-foreground"
          >
            <li v-for="link in col.links" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="hover:text-primary text-secondary-200 transition-colors duration-200"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contacts -->
        <div class="lg:col-span-2 flex flex-col gap-5">
          <h4
            class="text-secondary-foreground text-xs md:text-sm font-semibold tracking-widest uppercase"
          >
            Contacts
          </h4>
          <div class="flex flex-col gap-4 text-xs">
            <div
              v-for="c in contacts"
              :key="c.label"
              class="flex flex-col gap-1"
            >
              <span
                class="text-secondary-400 font-bold uppercase tracking-wider text-[10px]"
              >{{ c.label }}</span>
              <a
                v-if="c.href"
                :href="c.href"
                class="text-secondary-200 text-sm hover:text-primary transition-colors duration-200"
              >{{ c.value }}</a>
              <p
                v-else
                class="text-secondary-200 text-sm leading-relaxed whitespace-pre-line"
              >
                {{ c.value }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-secondary-800 py-6">
      <div
        class="max-w-400 mx-auto px-6 md:px-12 lg:px-20 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p class="text-white text-xs text-center sm:text-left">
          Kora &copy; 2026 All Rights Reserved
        </p>
        <div class="flex items-center gap-3">
          <a
            v-for="s in socials"
            :key="s.title"
            :href="s.href"
            :title="s.title"
            target="_blank"
            rel="noopener noreferrer"
            class="w-9 h-9 flex items-center justify-center rounded-lg bg-[#5E5D5C33] text-white hover:text-foreground hover:border-primary/50 hover:bg-background active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <UIcon :name="s.icon" class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
