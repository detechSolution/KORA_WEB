<script setup lang="ts">
import { computed } from "vue";
import { ICONS } from "~/config/icons";
import { IMAGES } from "~/utils/images";

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const handleSchedule = () => clearError({ redirect: "/schedules" });
const handleHome = () => clearError({ redirect: "/" });

// Set page title
useHead({
  title: "404 - Page Not Found",
});
</script>

<template>
  <div
    class="relative min-h-screen bg-background flex items-center justify-center px-4 py-12 overflow-hidden select-none"
  >
    <!-- Kora foliage decoration -->
    <div
      class="absolute top-0 right-0 w-50 md:w-60 lg:w-80 aspect-square z-10 -translate-y-12 pointer-events-none"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage decoration"
        class="w-full h-full object-cover"
      >
    </div>

    <div class="relative z-20 max-w-2xl w-full text-center flex flex-col items-center gap-5">
      <!-- Kora Logo -->
      <NuxtLink
        to="/"
        class="inline-block mb-2 focus:outline-none"
        @click="handleHome"
      >
        <img
          :src="isDark ? IMAGES.WHITE_LOGO : IMAGES.BLACK_LOGO"
          alt="KORA Logo"
          class="w-28 md:w-36 h-auto object-contain mx-auto"
        >
      </NuxtLink>

      <span
        class="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-primary"
      >
        404 Error
      </span>

      <h1
        class="font-serif text-4xl md:text-6xl text-foreground font-normal tracking-wide"
      >
        Page Not Found
      </h1>

      <p class="font-sans text-sm md:text-base text-secondary-400 max-w-lg leading-relaxed">
        The link you followed may be broken or the page may have been moved.
        Explore our schedule for upcoming sessions and wellness offerings.
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4 w-full sm:w-auto">
        <base-button
          variant="solid"
          color="primary"
          class="w-full sm:w-auto uppercase text-xs tracking-wider"
          to="/schedules"
          @click="handleSchedule"
        >
          View Schedule
        </base-button>

        <base-button
          variant="outline"
          color="primary"
          :leading-icon="ICONS.ARROW_LEFT"
          class="w-full sm:w-auto uppercase text-xs tracking-wider"
          to="/"
          @click="handleHome"
        >
          Back to Home
        </base-button>
      </div>
    </div>
  </div>
</template>
