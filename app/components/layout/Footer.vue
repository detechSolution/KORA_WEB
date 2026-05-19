<script setup lang="ts">
import { computed } from "vue";

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
</script>

<template>
  <footer
    class="bg-background text-foreground border-t border-border transition-colors duration-300"
  >
    <!-- Top Part: Grid Links -->
    <div class="max-w-full mx-auto px-6 md:px-12 lg:px-20 py-16">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-10 lg:gap-8"
      >
        <!-- Brand Slogan (4 columns) -->
        <div class="lg:col-span-4 flex flex-col gap-6">
          <!-- Logo -->
          <NuxtLink
            to="/"
            class="flex items-center gap-3 w-fit focus:outline-none"
          >
            <img
              :src="isDark ? '/logo/kora_white_logo.svg' : '/logo/kora_black_logo.svg'"
              alt="KORA Logo"
              class="w-12 h-12 md:w-32 md:h-8 object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </NuxtLink>
          <p
            class="text-muted-foreground text-sm leading-relaxed max-w-[280px] font-sans"
          >
            The bridge between the chaos of the city and the clarity of the
            self.
          </p>
        </div>

        <!-- Column 1: Spaces (2 columns) -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <h4
            class="text-foreground text-xs md:text-sm font-semibold tracking-widest uppercase"
          >
            Spaces
          </h4>
          <ul class="flex flex-col gap-3 text-xs md:text-sm text-muted-foreground">
            <li>
              <NuxtLink
                to="/spaces/class"
                class="hover:text-primary transition-colors duration-200"
                >CLASS</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/spaces/nutrition"
                class="hover:text-primary transition-colors duration-200"
                >NUTRITION</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/spaces/recovery"
                class="hover:text-primary transition-colors duration-200"
                >RECOVERY</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/spaces/wellness"
                class="hover:text-primary transition-colors duration-200"
                >WELLNESS</NuxtLink
              >
            </li>
          </ul>
        </div>

        <!-- Column 2: Navigate (2 columns) -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <h4
            class="text-foreground text-xs md:text-sm font-semibold tracking-widest uppercase"
          >
            Navigate
          </h4>
          <ul class="flex flex-col gap-3 text-xs md:text-sm text-muted-foreground">
            <li>
              <NuxtLink
                to="/sessions"
                class="hover:text-primary transition-colors duration-200"
                >SESSIONS</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/spa"
                class="hover:text-primary transition-colors duration-200"
                >SPA SANCTUARY</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/membership"
                class="hover:text-primary transition-colors duration-200"
                >MEMBERSHIP</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/schedule"
                class="hover:text-primary transition-colors duration-200"
                >SCHEDULE</NuxtLink
              >
            </li>
          </ul>
        </div>

        <!-- Column 3: Company (2 columns) -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <h4
            class="text-foreground text-xs md:text-sm font-semibold tracking-widest uppercase"
          >
            Company
          </h4>
          <ul class="flex flex-col gap-3 text-xs md:text-sm text-muted-foreground">
            <li>
              <NuxtLink
                to="/careers"
                class="hover:text-primary transition-colors duration-200"
                >CAREERS</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/feedback"
                class="hover:text-primary transition-colors duration-200"
                >FEEDBACK & INQUIRY</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/etiquette"
                class="hover:text-primary transition-colors duration-200"
                >KORA ETIQUETTE</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/csr"
                class="hover:text-primary transition-colors duration-200"
                >CSR</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/policy"
                class="hover:text-primary transition-colors duration-200"
                >TERMS & POLICY</NuxtLink
              >
            </li>
          </ul>
        </div>

        <!-- Column 4: Contacts (2 columns) -->
        <div class="lg:col-span-2 flex flex-col gap-5">
          <h4
            class="text-foreground text-xs md:text-sm font-semibold tracking-widest uppercase"
          >
            Contacts
          </h4>
          <div class="flex flex-col gap-4 text-xs">
            <!-- Email -->
            <div class="flex flex-col gap-1">
              <span
                class="text-muted-foreground font-bold uppercase tracking-wider text-[10px]"
                >Email</span
              >
              <a
                href="mailto:kora@gmail.com"
                class="text-foreground hover:text-primary transition-colors duration-200"
                >kora@gmail.com</a
              >
            </div>
            <!-- Phone -->
            <div class="flex flex-col gap-1">
              <span
                class="text-muted-foreground font-bold uppercase tracking-wider text-[10px]"
                >Phone</span
              >
              <span class="text-foreground">01-4785467, 9845787654</span>
            </div>
            <!-- Address -->
            <div class="flex flex-col gap-1">
              <span
                class="text-muted-foreground font-bold uppercase tracking-wider text-[10px]"
                >Address</span
              >
              <p class="text-foreground leading-relaxed">
                Golfutar, Budhanilkantha-08,<br />Kathmandu 44600
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Part: Divider & Copyright & Socials -->
    <div class="border-t border-border/60 py-6">
      <div
        class="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <!-- Copyright -->
        <p class="text-muted-foreground text-xs text-center sm:text-left">
          Kora &copy; 2026 All Rights Reserved
        </p>
        <!-- Social Icons -->
        <div class="flex items-center gap-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-9 h-9 flex items-center justify-center rounded-lg bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-background active:scale-95 transition-all duration-200 cursor-pointer"
            title="Instagram"
          >
            <UIcon name="i-lucide-instagram" class="w-4 h-4" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-9 h-9 flex items-center justify-center rounded-lg bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-background active:scale-95 transition-all duration-200 cursor-pointer"
            title="Facebook"
          >
            <UIcon name="i-lucide-facebook" class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
