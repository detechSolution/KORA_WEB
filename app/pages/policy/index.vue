<script setup lang="ts">
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Terms & Policy",
  description:
    "By accessing or using Kora's services, guests agree to our terms, which are designed to ensure a safe, respectful, and seamless experience for everyone.",
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
      />
    </div>

    <!-- Premium absolute-positioned foliage watermark overlay (Right) -->
    <div
      class="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 xl:w-[480px] xl:h-[480px] pointer-events-none select-none z-100000 opacity-30 md:opacity-40"
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
          Terms &amp; Policy
        </h1>
        <p
          class="text-xs md:text-base leading-relaxed text-secondary-500 dark:text-secondary-400 font-light max-w-3xl mx-auto"
        >
          By accessing or using Kora's services, guests agree to our terms,
          which are designed to ensure a safe, respectful, and seamless
          experience for everyone.
        </p>
      </div>

      <div class="max-w-400 md:px-6 mx-auto py-24">
        <div class="space-y-8">
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3
              class="font-serif text-secondary dark:text-white text-xl md:text-2xl font-normal"
            >
              Use Of Services
            </h3>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              Guests are expected to use Kora's spaces and services in a
              respectful and responsible manner.
            </p>
            <div
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light space-y-2"
            >
              <p>You agree not to:</p>
              <ul class="list-disc list-inside space-y-1 pl-2">
                <li>Engage in disruptive, abusive, or unsafe behavior</li>
                <li>Misuse or damage property, equipment, or facilities</li>
                <li>
                  Violate any applicable laws or regulations while on premises
                </li>
                <li>
                  Interfere with the experience of other guests or staff
                </li>
              </ul>
            </div>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              Kora reserves the right to refuse service or remove individuals
              whose behavior compromises safety, comfort, or the integrity of
              the environment.
            </p>
          </div>

          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3
              class="font-serif text-secondary dark:text-white text-xl md:text-2xl font-normal"
            >
              Reservations &amp; Access
            </h3>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              Certain Kora services, including dining and wellness experiences,
              may require prior reservations.
            </p>
            <ul
              class="list-disc list-inside space-y-1 pl-2 text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              <li>Reservations are subject to availability and confirmation</li>
              <li>
                Late arrivals may result in reduced service time or cancellation
              </li>
              <li>
                Kora reserves the right to modify or decline bookings where
                necessary
              </li>
            </ul>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              We encourage guests to arrive on time to fully experience the
              intended flow of service.
            </p>
          </div>

          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3
              class="font-serif text-secondary dark:text-white text-xl md:text-2xl font-normal"
            >
              Payments &amp; Pricing
            </h3>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              All prices are displayed in local currency unless otherwise
              specified.
            </p>
            <ul
              class="list-disc list-inside space-y-1 pl-2 text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              <li>
                Payment is required at the time of service unless otherwise
                arranged
              </li>
              <li>
                Accepted payment methods will be listed at each location
              </li>
              <li>Prices are subject to change without prior notice</li>
              <li>
                Taxes and applicable charges may be included or added at
                checkout depending on jurisdiction
              </li>
            </ul>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              Transparency is a priority, even if taxes remain emotionally
              complicated for everyone involved.
            </p>
          </div>

          <div class="flex flex-col gap-6 pb-6">
            <h3
              class="font-serif text-secondary dark:text-white text-xl md:text-2xl font-normal"
            >
              Cancellations &amp; Refunds
            </h3>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              Cancellation policies may vary depending on the service type.
            </p>
            <ul
              class="list-disc list-inside space-y-1 pl-2 text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              <li>
                Cancellations should be made within the specified time frame
                for eligibility
              </li>
              <li>Late cancellations or no-shows may incur charges</li>
              <li>
                Refunds, where applicable, will be processed in accordance
                with service-specific policies
              </li>
            </ul>
            <p
              class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light"
            >
              Kora aims to handle all cases fairly and with consideration.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
