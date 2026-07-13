<script setup lang="ts">
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | CSR",
  description:
    "At Kora, we believe hospitality should create a positive impact beyond our spaces. Through mindful practices, community support, and sustainable choices, we are committed to contributing meaningfully.",
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

    <div class="relative z-20 mx-auto px-4 md:px-8">
      <div class="border-b border-border text-center space-y-8 pb-16">
        <h1
          class="font-serif text-3xl md:text-5xl lg:text-6xl text-secondary dark:text-white font-normal tracking-wide"
        >
          Corporate Social Responsibility
        </h1>
        <p
          class="text-xs md:text-base leading-relaxed text-secondary-500 dark:text-secondary-400 font-light max-w-3xl mx-auto"
        >
          At Kora, we believe hospitality should create a positive impact beyond
          our spaces. Through mindful practices, community support, sustainable
          choices, and responsible operations, we are committed to contributing
          meaningfully to the people, culture, and environment around us.
        </p>
      </div>

      <div class="max-w-400 md:px-6 mx-auto py-24">
        <div class="space-y-8">
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3
              class="font-serif text-secondary dark:text-white text-xl md:text-2xl font-normal"
            >
              Scaled for Collective Elevation
            </h3>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              We firmly believe that individual luxury cannot exist
              independently of community health. KORA operates on a deeply
              integrated, regenerative business model where local impact is
              built directly into our bottom-line architecture. Our core social
              impact strategy is driven entirely through <span class="font-bold">Cali Nepal</span>, our
              dedicated, registered non-profit organizational arm. A fixed
              percentage of every membership generated within our sanctuary is
              directly reinvested into Cali Nepal to fund community growth
              initiatives, grassroots youth fitness outreach, and public health
              education platforms. Looking ahead, our vision extends
              purposefully beyond our internal walls. In strict adherence to
              local government urban frameworks and spearheaded alongside Cali
              Nepal, our long-term blueprint includes the development of curated
              public outdoor movement spaces. Designed as inclusive, open-air
              wellness parks for the broader society, these spaces will provide
              the local community with free, high-tier infrastructure for
              functional fitness and somatic health. Through this structured CSR
              framework, our members actively participate in a continuous cycle
              of regional empowerment and holistic development, ensuring that
              our presence inside Kathmandu creates a lasting, measurable
              benefit.
            </p>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              Our approach to Corporate Social Responsibility is rooted in
              mindfulness, sustainability, and long-term impact. We aim to
              create experiences that feel meaningful not only for our guests,
              but also for the communities and environments connected to Kora.
            </p>
          </div>
          <!-- <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3
              class="font-serif text-secondary dark:text-white text-xl md:text-2xl font-normal"
            >
              Mindful Hospitality
            </h3>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              We believe luxury and responsibility should exist together. Across
              our spaces, we prioritize thoughtful operations, reduced waste,
              and intentional material choices that align with our philosophy of
              simplicity and care.
            </p>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              From reducing unnecessary plastics to choosing durable, tactile
              materials, every decision is guided by longevity and environmental
              awareness.
            </p>
          </div>
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3
              class="font-serif text-secondary dark:text-white text-xl md:text-2xl font-normal"
            >
              Creating Meaningful Spaces
            </h3>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              Every Kora experience is designed to encourage stillness,
              connection, and restoration. Whether through hospitality,
              wellness, or design, our goal is to create environments that
              positively impact how people feel.
            </p>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              We believe thoughtful spaces can inspire calmer interactions,
              healthier routines, and a deeper sense of presence in everyday
              life.
            </p>
          </div>
          <div class="flex flex-col gap-6 pb-6">
            <h3
              class="font-serif text-secondary dark:text-white text-xl md:text-2xl font-normal"
            >
              Supporting Local Communities
            </h3>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              Kora values local craftsmanship, culture, and human connection.
              Wherever possible, we seek to collaborate with local artisans,
              suppliers, creators, and service partners who share our
              appreciation for quality and authenticity.
            </p>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              By supporting local communities, we help preserve traditions,
              encourage sustainable growth, and create more meaningful
              experiences for our guests.
            </p>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
