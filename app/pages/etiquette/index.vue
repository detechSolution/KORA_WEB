<script setup lang="ts">
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Etiquette",
  description:
    "At Kora, we value respect, kindness, and thoughtful behavior in every interaction. Our etiquettes reflect the standards we uphold across our spaces, experiences, and community",
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
          <!-- The Sensory Environment -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              The Sensory Environment
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              To preserve the signature sensory environment, stillness, and mutual tranquility of KORA, all members and guests are requested to observe our foundational codes of conduct.
            </p>
          </div>

          <!-- Arrival & Punctuality -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Arrival &amp; Punctuality
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Guests are required to reach their designated class at least 5 minutes before the start of the class, and are highly encouraged to arrive at the KORA premises 10 to 15 minutes prior to the class time. To preserve the stillness and sensory focus of our spaces, access will close automatically at the exact moment a session commences. Late entry is not permitted.
            </p>
          </div>

          <!-- Waitlist Protocol -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Waitlist Protocol
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              To accommodate our active waitlist community, reserved spots that remain unclaimed at the exact scheduled start time will be immediately released to waiting members present.
            </p>
          </div>

          <!-- Personal Optimization & Commerce -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Personal Optimization &amp; Commerce
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              KORA is a dedicated space for personal optimization, health rejuvenation, and shared community growth. The conduct of personal commerce, unauthorized commercial content creation, external personal training, or unsolicited professional marketing within the premises is strictly forbidden.
            </p>
          </div>

          <!-- Mutual Respect -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Mutual Respect
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              We maintain a rigorous standard of mutual respect, tranquility, and peace. Verbal aggression, discriminatory actions, loud or disruptive behavior, or harassment of any member, guest, or team artisan will result in immediate, temporary access suspension.
            </p>
          </div>

          <!-- Digital Detox -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Digital Detox
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              In alignment with our commitment to sensory luxury, cellular devices must be set to silent or do-not-disturb profiles immediately upon crossing our threshold. Voice calls, audio playbacks, or loudspeaker usage are prohibited across all movement floors, recovery zones, spa, and lounges.
            </p>
          </div>

          <!-- Content Creation -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Content Creation
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              While we appreciate the capturing of your personal aesthetic journey, content creation must be entirely localized, quiet, and unobtrusive to fellow guests. Photographing or recording other members without their explicit, prior verbal consent is an absolute breach of policy. Visual media recording of any nature is strictly prohibited inside the changing suites, locker chambers, saunas, and contrast thermal zones.
            </p>
          </div>

          <!-- Dress Code & Attire -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Dress Code &amp; Attire
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Clean, professional athletic apparel and dedicated interior footwear are required on all movement floors. Clean, appropriate swimwear is mandatory at all times within the thermal recovery suites (saunas, Jacuzzi, and cold plunges).
            </p>
          </div>

          <!-- Hygiene & Equipment Care -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Hygiene &amp; Equipment Care
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Guests are requested to practice elevated personal hygiene, utilize a clean towel across all active training surfaces, wipe down apparatus post-use with provided organic solutions, and return all training elements to their proper resting state.
            </p>
          </div>

          <!-- A Safe Sanctuary -->
          <div class="flex flex-col gap-6 pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              A Safe Sanctuary
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Our environment is entirely weapon-free, drug-free, and smoke-free (including vaping). Accessing the training floors, saunas, or pools while under the influence of alcohol, drugs, or medications that impair safe physical participation is strictly prohibited. If alcohol is consumed at an authorized on-site event or vendor, users are strictly barred from re-entering the fitness or thermal recovery zones for the remainder of that day.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
