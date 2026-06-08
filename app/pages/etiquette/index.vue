<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Etiquette",
  description:
    "At Kora, we value respect, kindness, and thoughtful behavior in every interaction. Our etiquettes reflect the standards we uphold across our spaces, experiences, and community",
});

const authStore = useAuthStore();
const router = useRouter();
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

    <div class="relative z-20 mx-auto px-4 md:px-8">
      <div class="border-b border-border text-center space-y-8 pb-16">
        <h1
          class="font-serif text-3xl md:text-5xl lg:text-6xl text-secondary dark:text-white font-normal tracking-wide"
        >
          Kora Etiquette
        </h1>
        <p
          class="text-xs md:text-base leading-relaxed text-secondary-500 dark:text-secondary-400 font-light max-w-3xl mx-auto"
        >
          At Kora, we value respect, kindness, and thoughtful behavior in every
          interaction. Our etiquettes reflect the standards we uphold across our
          spaces, experiences, and community
        </p>
      </div>

      <div class="max-w-400 md:px-6 mx-auto py-24">
        <div class="space-y-8">
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3
              class="font-serif text-secondary dark:text-white text-xl md:text-2xl font-normal"
            >
              A Philosophy Of Presence
            </h3>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              Kora is built on the belief that true luxury feels calm,
              intentional, and deeply human. Every detail within our spaces,
              from the way guests are welcomed to the textures they touch, is
              designed to create a sense of ease and quiet refinement.
            </p>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              Our etiquettes are not rules. They are rituals that shape the Kora
              experience through thoughtful hospitality, timeless design, and
              mindful interaction.
            </p>
          </div>
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3
              class="font-serif text-secondary dark:text-white text-xl md:text-2xl font-normal"
            >
              The Greeting
            </h3>
            <div
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light space-y-3"
            >
              <p>
                Every guest should feel recognized, welcomed, and at peace from
                the moment they arrive.
              </p>
              <div>
                <p>At Kora, we do not ask:</p>
                <p class="font-semibold text-secondary dark:text-white">
                  "How can I help you?"
                </p>
              </div>
              <div>
                <p>Instead, we say:</p>
                <p class="font-semibold text-secondary dark:text-white">
                  "Welcome back. Your sanctuary is ready."
                </p>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3
              class="font-serif text-secondary dark:text-white text-xl md:text-2xl font-normal"
            >
              NORI Cafe
            </h3>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              NORI is the social heart of Kora. Rooted in minimalism and tactile
              luxury, the space is designed to feel clean, grounded, and quietly
              refined through thoughtful materials, ceramic tableware,
              typography-led presentation, and calm, intentional hospitality.
            </p>
          </div>
          <div class="flex flex-col gap-6 pb-6">
            <h3
              class="font-serif text-secondary dark:text-white text-xl md:text-2xl font-normal"
            >
              NUAD Standards
            </h3>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              NUAD is the restorative soul of Kora. Designed to feel both
              clinical and spiritual, the experience is shaped through silence,
              seasonal scent rituals, warm natural elements, and mindful service
              that encourages stillness, balance, and renewal.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
