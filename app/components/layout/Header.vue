<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
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

// Scroll listener to toggle header background color on scroll
const isScrolled = ref(false);
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300',
      isScrolled
        ? 'bg-background/90 backdrop-blur-md border-b border-border/80 shadow-sm py-1'
        : 'bg-transparent border-b border-transparent py-3',
    ]"
  >
    <div
      class="max-w-400 h-25 mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between"
    >
      <!-- Left: Menu Trigger -->
      <div
        class="flex-1 flex items-center"
        :class="
          isDark
            ? 'text-white'
            : !isDark && !isScrolled
              ? 'text-white'
              : 'text-black'
        "
      >
        <button
          class="group flex items-center gap-2.5 hover:text-primary transition-colors duration-200 cursor-pointer py-1.5 focus:outline-none"
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
            isDark
              ? '/logo/kora_white_logo.svg'
              : !isDark && !isScrolled
                ? '/logo/kora_white_logo.svg'
                : '/logo/kora_black_logo.svg'
          "
          alt="KORA Logo"
          class="w-12 h-12 md:w-32 md:h-8 object-contain group-hover:scale-105 transition-transform duration-200"
        />
      </NuxtLink>

      <!-- Right: Action items -->
      <div class="flex-1 flex items-center justify-end gap-3 md:gap-4">
        <!-- Wifi Status Button (Replacer of theme toggle) -->
        <!-- Dark Mode Toggle Button -->
        <button
          @click="toggleColorMode"
          class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center border border-primary/40 text-primary hover:bg-primary/10 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none"
          title="Toggle Theme"
        >
          <UIcon
            :name="isDark ? ICONS.SUN : ICONS.MOON"
            class="w-4 h-4 md:w-5 md:h-5"
          />
        </button>

        <!-- Cart Button -->
        <button
          class="flex w-9 h-9 md:w-10 md:h-10 items-center justify-center border border-primary/40 text-primary hover:bg-primary/10 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none"
          title="Cart"
        >
          <UIcon
            :name="ICONS.HANDBAG"
            class="w-4 h-4 md:w-5 md:h-5 text-primary"
          />
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

        <!-- Profile Avatar with premium gold border -->
        <NuxtLink
          to="/profile"
          class="hidden sm:inline-flex w-9 h-9 md:w-10 md:h-10 rounded-full border border-primary/40 overflow-hidden cursor-pointer active:scale-95 transition-transform duration-200 shadow-sm"
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
