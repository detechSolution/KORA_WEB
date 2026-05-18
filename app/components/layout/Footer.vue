<script setup lang="ts"></script>

<template>
  <footer
    class="bg-[#0D0D0E] text-stone-300 border-t border-stone-900 transition-colors duration-300"
  >
    <!-- Top Part: Grid Links -->
    <div class="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-16">
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
              :src="'/logo/kora_white_logo.svg'"
              alt="KORA Logo"
              class="w-12 h-12 md:w-32 md:h-8 object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </NuxtLink>
          <p
            class="text-stone-400 text-sm leading-relaxed max-w-[280px] font-sans"
          >
            The bridge between the chaos of the city and the clarity of the
            self.
          </p>
        </div>

        <!-- Column 1: Spaces (2 columns) -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <h4
            class="text-white text-xs md:text-sm font-semibold tracking-widest uppercase"
          >
            Spaces
          </h4>
          <ul class="flex flex-col gap-3 text-xs md:text-sm text-stone-400">
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
            class="text-white text-xs md:text-sm font-semibold tracking-widest uppercase"
          >
            Navigate
          </h4>
          <ul class="flex flex-col gap-3 text-xs md:text-sm text-stone-400">
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
            class="text-white text-xs md:text-sm font-semibold tracking-widest uppercase"
          >
            Company
          </h4>
          <ul class="flex flex-col gap-3 text-xs md:text-sm text-stone-400">
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
            class="text-white text-xs md:text-sm font-semibold tracking-widest uppercase"
          >
            Contacts
          </h4>
          <div class="flex flex-col gap-4 text-xs">
            <!-- Email -->
            <div class="flex flex-col gap-1">
              <span
                class="text-stone-500 font-bold uppercase tracking-wider text-[10px]"
                >Email</span
              >
              <a
                href="mailto:kora@gmail.com"
                class="text-stone-300 hover:text-primary transition-colors duration-200"
                >kora@gmail.com</a
              >
            </div>
            <!-- Phone -->
            <div class="flex flex-col gap-1">
              <span
                class="text-stone-500 font-bold uppercase tracking-wider text-[10px]"
                >Phone</span
              >
              <span class="text-stone-300">01-4785467, 9845787654</span>
            </div>
            <!-- Address -->
            <div class="flex flex-col gap-1">
              <span
                class="text-stone-500 font-bold uppercase tracking-wider text-[10px]"
                >Address</span
              >
              <p class="text-stone-300 leading-relaxed">
                Golfutar, Budhanilkantha-08,<br />Kathmandu 44600
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Part: Divider & Copyright & Socials -->
    <div class="border-t border-stone-900/60 py-6">
      <div
        class="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <!-- Copyright -->
        <p class="text-stone-500 text-xs text-center sm:text-left">
          Kora &copy; 2026 All Rights Reserved
        </p>
        <!-- Social Icons -->
        <div class="flex items-center gap-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-9 h-9 flex items-center justify-center rounded-lg bg-stone-900/80 border border-stone-800 text-stone-300 hover:text-white hover:border-stone-700 hover:bg-stone-850 active:scale-95 transition-all duration-200"
            title="Instagram"
          >
            <UIcon name="i-lucide-instagram" class="w-4 h-4" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            class="w-9 h-9 flex items-center justify-center rounded-lg bg-stone-900/80 border border-stone-800 text-stone-300 hover:text-white hover:border-stone-700 hover:bg-stone-850 active:scale-95 transition-all duration-200"
            title="Facebook"
          >
            <UIcon name="i-lucide-facebook" class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
