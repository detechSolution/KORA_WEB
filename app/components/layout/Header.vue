<script setup lang="ts">
import { computed } from "vue";
import { ICONS } from "~/config/icons";

// Nuxt Color Mode
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(val) {
    colorMode.preference = val ? "dark" : "light";
  },
});

const toggleColorMode = () => {
  isDark.value = !isDark.value;
};
</script>

<template>
  <header class="w-full bg-transparent transition-colors duration-300">
    <div
      class="max-w-400 h-25 mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between"
    >
      <!-- Left: Menu Trigger -->
      <div class="flex-1 flex items-center">
        <button
          class="group flex items-center gap-2.5 text-secondary-900 dark:text-stone-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 cursor-pointer py-1.5 focus:outline-none"
        >
          <span class="flex flex-col gap-1 w-5">
            <span
              class="h-0.5 w-full bg-current transition-transform duration-200 group-hover:translate-x-0.5"
            ></span>
            <span
              class="h-0.5 w-4 bg-current transition-transform duration-200 group-hover:translate-x-1"
            ></span>
            <span
              class="h-0.5 w-5 bg-current transition-transform duration-200 group-hover:translate-x-0.5"
            ></span>
          </span>
          <span
            class="text-xs md:text-sm font-semibold uppercase tracking-widest font-sans"
            >Menu</span
          >
        </button>
      </div>

      <!-- Center: Logo -->
      <NuxtLink to="/" class="flex items-center gap-3 focus:outline-none group">
        <img
          :src="
            isDark ? '/logo/kora_white_logo.svg' : '/logo/kora_black_logo.svg'
          "
          alt="KORA Logo"
          class="w-12 h-12 md:w-32 md:h-8 object-contain group-hover:scale-105 transition-transform duration-200"
        />
      </NuxtLink>

      <!-- Right: Action items -->
      <div class="flex-1 flex items-center justify-end gap-3 md:gap-4">
        <!-- Dark Mode Toggle Button -->
        <button
          @click="toggleColorMode"
          class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center border border-primary-500/40 dark:border-primary/40 text-primary hover:bg-primary-50 dark:hover:bg-stone-850/60 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none"
          title="Toggle Theme"
        >
          <UIcon
            :name="isDark ? ICONS.MOON : ICONS.SUN"
            class="w-4 h-4 md:w-5 md:h-5"
          />
        </button>

        <!-- Cart Button -->
        <button
          class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center border border-primary-500/40 dark:border-primary/40 text-primary hover:bg-primary-50 dark:hover:bg-stone-850/60 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none"
          title="Cart"
        >
          <UIcon :name="ICONS.HANDBAG" class="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <!-- Membership CTA Button -->
        <base-button
          to="/membership"
          variant="solid"
          color="primary"
          class="hidden sm:inline-flex px-4 md:px-6 py-2 md:py-2.5 text-[10px] md:text-xs uppercase tracking-widest transition-all duration-200 focus:outline-none shadow-sm active:scale-95"
        >
          Membership
        </base-button>

        <!-- Profile Avatar -->
        <NuxtLink
          to="/profile"
          class="w-9 h-9 md:w-10 md:h-10 rounded-full border border-stone-200/80 dark:border-stone-800 overflow-hidden cursor-pointer active:scale-95 transition-transform duration-200 shadow-sm"
        >
          <img
            src="/avatar.png"
            alt="User Profile"
            class="w-full h-full object-cover"
          />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
