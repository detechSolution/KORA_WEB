<script setup lang="ts">
import { useRouter } from "vue-router";
import { ICONS } from "~/config/icons";
import { useAuthStore } from "~/stores/auth";
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Careers",
  description:
    "At Kora, we’re building more than a workplace. We’re creating a team driven by creativity, craftsmanship, and meaningful experiences.",
});
</script>

<template>
  <div
    class="relative bg-background dark:bg-secondary-900 text-foreground dark:text-white transition-colors duration-300 w-full min-h-screen py-12 overflow-hidden"
  >
    <!-- Premium absolute-positioned foliage watermark overlay (Left) -->
    <div
      class="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 xl:w-[480px] xl:h-[480px] pointer-events-none select-none z-10 opacity-30 md:opacity-40"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage left"
        class="w-full h-full object-cover scale-x-[-1] -translate-x-12 -translate-y-12 rotate-12"
      >
    </div>

    <!-- Premium absolute-positioned foliage watermark overlay (Right) -->
    <div
      class="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 xl:w-[480px] xl:h-[480px] pointer-events-none select-none z-100000 opacity-30 md:opacity-40"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage right"
        class="w-full h-full object-cover translate-x-12 -translate-y-12 -rotate-12"
      >
    </div>

    <div class="relative z-20 max-w-400 mx-auto text-center px-4 md:px-8">
      <div class="border-b border-border text-center space-y-8 pb-16">
        <h1
          class="font-serif text-3xl md:text-5xl lg:text-6xl text-secondary dark:text-white font-normal tracking-wide"
        >
          Careers
        </h1>
        <p
          class="text-xs md:text-base leading-relaxed text-secondary-500 dark:text-secondary-400 font-light max-w-3xl mx-auto"
        >
          At Kora, we’re building more than a workplace. We’re creating a team
          driven by creativity, craftsmanship, and meaningful experiences.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12  items-center py-24">
        <div class="flex flex-col gap-6 text-start">
          <h3 class="text-4xl font-serif font-semibold">
            Be Part of Kora
          </h3>
          <p
            class="text-xs md:text-base leading-relaxed text-foreground/75 dark:text-secondary-200 font-light max-w-3xl mx-auto"
          >
            We’re always looking for passionate, thoughtful, and talented people
            to grow with us. If you believe you’d be a great fit for Kora, we’d
            love to hear your story. Send your CV, portfolio, or a short
            introduction to our email, and our team will get in touch if there’s
            a suitable opportunity.
          </p>

          <div class="bg-primary/10 w-full  flex items-center  gap-2 p-6">
            <UIcon :name="ICONS.EMAIL" class="text-primary-700" /> <p class="dark:text-secondary-50 text-secondary font-semibold text-[16px]">
              Email: career@kora.com
            </p>
          </div>
        </div>
        <div>
          <img
            :src="IMAGES.RECOVERY_SWIMMING_POOL"
            alt="Kora foliage left"
            class="w-full h-full object-cover scale-x-[-1] "
          >
        </div>
      </div>
    </div>
  </div>
</template>
