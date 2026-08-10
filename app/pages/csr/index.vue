<script setup lang="ts">
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | CSR",
  description:
    "KORA's CSR philosophy is rooted in environmental stewardship, conscious architecture, and community collaboration that extends wellness beyond the sanctuary.",
});
</script>

<template>
  <div
    class="relative bg-background dark:bg-secondary-900 text-foreground dark:text-white transition-colors duration-300 w-full min-h-screen py-12 overflow-hidden"
  >
    <!-- Premium absolute-positioned foliage watermark overlay (Left) -->
    <div
      class="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 xl:w-120 xl:h-120 pointer-events-none select-none z-10 opacity-30 md:opacity-40"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage left"
        class="w-full h-full object-cover scale-x-[-1] -translate-x-12 -translate-y-12 rotate-12"
      />
    </div>

    <!-- Premium absolute-positioned foliage watermark overlay (Right) -->
    <div
      class="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 xl:w-120 xl:h-120 pointer-events-none select-none z-100000 opacity-30 md:opacity-40"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage right"
        class="w-full h-full object-cover translate-x-12 -translate-y-12 -rotate-12"
      />
    </div>

    <div class="relative z-20 mx-auto px-4 md:px-8">
      <div class="border-b border-border text-center space-y-8 pb-16">
        <h1
          class="font-serif text-3xl md:text-5xl lg:text-6xl text-secondary dark:text-white font-normal tracking-wide"
        >
          Sanctuary with Purpose
        </h1>
        <p
          class="text-xs md:text-base leading-relaxed text-secondary-500 dark:text-secondary-400 font-light max-w-3xl mx-auto"
        >
          At KORA, luxury is measured by harmony with nature, with our breath,
          and with the community we call home. We believe true well-being
          extends beyond our sanctuary, rooted in a quiet responsibility to
          elevate the collective space around us.
        </p>
      </div>

      <div class="max-w-400 md:px-6 mx-auto py-24">
        <div class="space-y-8">
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3
              class="font-serif text-secondary dark:text-white text-xl md:text-2xl font-normal"
            >
              Our Pillars
            </h3>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              KORA's Corporate Social Responsibility is guided by two core
              commitments: protecting the integrity of our environment through
              conscious design, and expanding wellness through meaningful
              community connection. Each pillar reflects a belief that a true
              sanctuary should care for the land it stands on and the people it
              serves.
            </p>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              Our work is not defined by performative gestures, but by
              consistent choices that protect resources, respect local context,
              and invite collective well-being. We aim to build a standard of
              hospitality that feels grounded, generous, and responsible.
            </p>
          </div>

          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3
              class="font-serif text-secondary dark:text-white text-xl md:text-2xl font-normal"
            >
              Earth & Conscious Architecture
            </h3>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              Designed as a living ecosystem, KORA integrates energy-efficient
              architecture, native landscaping, and smart water preservation to
              minimize our environmental footprint. To protect the sanctity of
              our air and the health of our guests, KORA is a strictly
              non-smoking, zero-plastic sanctuary where purity comes first.
            </p>
          </div>

          <div class="flex flex-col gap-6 pb-6">
            <h3
              class="font-serif text-secondary dark:text-white text-xl md:text-2xl font-normal"
            >
              Collective Energy & Community
            </h3>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              True wellness thrives when shared. KORA actively collaborates with
              non-profit associations, athletic clubs, and community
              organizations to co-host free public events, movement workshops,
              and open wellness gatherings. By opening our resources to local
              movements, we nurture a broader culture of vitality across the
              valley.
            </p>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light italic"
            >
              “Wellness is not an isolation from the world, but a deeper
              integration with it.”
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
