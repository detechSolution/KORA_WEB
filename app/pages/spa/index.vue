<script setup lang="ts">
import { ref } from "vue";
import { availableDays, offerings } from "~/data/spa";
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Spa Sanctuary",
  description:
    "Experience true relaxation with our curated spa offerings including massages and therapies.",
});

const isPlayingVideo = ref(false);

const accordionItems = offerings.map((o) => ({
  id: o.id,
  label: o.label,
  description: o.description,
  prices: o.prices,
}));
</script>

<template>
  <section
    class="relative bg-background dark:bg-secondary-900 text-foreground dark:text-white transition-colors duration-300 w-full"
  >
    <!-- Premium absolute-positioned foliage watermark overlay -->
    <div
      class="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 xl:w-50 aspect-square z-10 -translate-y-12 "
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage decoration"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="relative z-10 max-w-400 mx-auto">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        <!-- Left Column -->
        <div>
          <ClassHeader title="Spa Sanctuary" />
          <div class="max-w-400 px-4 md:px-8 lg:px-12 py-10 md:py-7">
            <p
              class="text-sm md:text-[15px] leading-7 text-foreground/90 dark:text-[#f4f3f1]/90"
            >
              Our swimming pool service ensures your pool remains clean, safe,
              and ready to enjoy at all times. With regular maintenance and
              professional care, we handle everything from water treatment to
              equipment checks, so you can relax and make the most of your pool
              without the hassle. Whether it's routine upkeep or a deep clean,
              our team delivers reliable service tailored to your needs.
            </p>
          </div>

          <div class="max-w-400 px-4 md:px-8 lg:px-12 py-10 md:py-7">
            <h2
              class="font-sans font-bold text-sm uppercase tracking-[0.2em] mb-4 text-foreground dark:text-[#f4f3f1]"
            >
              What's Included:
            </h2>
            <ul
              class="space-y-2 text-sm md:text-[15px] text-foreground/90 dark:text-[#f4f3f1]/90"
            >
              <li class="flex gap-3">
                <span
                  class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black dark:bg-white"
                ></span>
                <span>Routine cleaning and debris removal</span>
              </li>
              <li class="flex gap-3">
                <span
                  class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black dark:bg-white"
                ></span>
                <span>Water testing and chemical balancing</span>
              </li>
              <li class="flex gap-3">
                <span
                  class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black dark:bg-white"
                ></span>
                <span>Filter and pump inspection</span>
              </li>
              <li class="flex gap-3">
                <span
                  class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black dark:bg-white"
                ></span>
                <span>Tile and surface brushing</span>
              </li>
              <li class="flex gap-3">
                <span
                  class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black dark:bg-white"
                ></span>
                <span>Seasonal maintenance and system checks</span>
              </li>
            </ul>

            <div class="mt-12">
              <base-section-label
                label="Feature Video"
                align="left"
                class="mb-4"
              />
              <div
                v-if="!isPlayingVideo"
                class="relative overflow-hidden group cursor-pointer h-[300px] md:h-[460px] bg-muted"
                @click="isPlayingVideo = true"
              >
                <img
                  :src="IMAGES.EXPERIENCE_MAIN"
                  alt="Spa Feature"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  class="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50"
                ></div>

                <!-- Corner Brackets -->
                <div
                  class="absolute top-6 left-6 w-8 h-8 border-t border-l border-primary/70"
                ></div>
                <div
                  class="absolute top-6 right-6 w-8 h-8 border-t border-r border-primary/70"
                ></div>
                <div
                  class="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-primary/70"
                ></div>
                <div
                  class="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-primary/70"
                ></div>

                <!-- Play Button Center -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div
                    class="w-16 h-16 md:w-20 md:h-20 border border-primary/60 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all duration-300 group-hover:bg-black/40 group-hover:scale-110"
                  >
                    <svg
                      class="w-6 h-6 md:w-8 md:h-8 text-primary translate-x-1"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div v-else class="w-full h-[300px] md:h-[460px] bg-black">
                <iframe
                  class="w-full h-full"
                  src="https://www.youtube.com/embed/unCya_-8ECs?autoplay=1"
                  title="YouTube video player"
                  frameborder="0"
                  allow="autoplay; encrypted-media"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>

          <div class="max-w-400 px-4 md:px-8 lg:px-12 py-10 md:py-7">
            <base-section-label
              label="Available Offerings"
              align="left"
              class="mb-4"
            />
            <UAccordion
              :items="accordionItems"
              :ui="{
                root: 'w-full flex flex-col gap-4',
                item: 'border border-border dark:bg-[#212121] p-6 dark:text-white font-serif rounded-xs',
                label: 'text-xl',
                body: 'mt-4',
              }"
            >
              <template #default="{ item }">
                <div class="flex flex-col">
                  <span>{{ item.label }}</span>
                  <p class="text-sm text-foreground/80 dark:text-secondary-500 mt-4">
                    {{ item.description }}
                  </p>
                </div>
              </template>
              <template #content="{ item }">
                

                <!-- Pricing Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div
                    v-for="(duration, index) in item.prices"
                    :key="index"
                    class="group relative border border-white/10 dark:border-white/10 bg-[#c9a55a]/10 dark:bg-[#2A2722] rounded-xs p-4 flex flex-col justify-between transition-all duration-300"
                  >
                    <div>
                      <div
                        class="flex items-center gap-2 text-xs uppercase text-secondary-500"
                      >
                        <UIcon
                          name="i-lucide-clock"
                          class="h-3.5 w-3.5 text-primary"
                        />
                        <span class="text-primary text-sm">{{
                          duration.duration
                        }}</span>
                      </div>

                      <p class="text-3xl font-medium text-foreground mt-3">
                        {{ duration.price }}
                      </p>
                    </div>

                    <div class="mt-3 flex items-center justify-between">
                      <base-button variant="link" class="text-primary p-0">
                        Tap to Book
                        <UIcon
                          name="i-lucide-arrow-right"
                          class="h-4 w-4 transition-transform group-hover:translate-x-1"
                        />
                      </base-button>
                    </div>
                  </div>
                </div>
              </template>
            </UAccordion>
          </div>
        </div>

        <!-- Right Column (Sidebar) -->
        <aside class="sticky lg:top-28 lg:self-start px-4 md:px-8 lg:px-0">
          <div class="border border-border bg-card px-5 py-5 md:px-6">
            <p class="text-[10px] uppercase text-primary mb-3">
              Book Your Spot
            </p>
            <h3
              class="font-serif text-3xl text-foreground dark:text-white mb-8"
            >
              5 Offerings Available
            </h3>

            <div class="space-y-6">
              <div v-for="offering in offerings" :key="offering.id">
                <div class="flex justify-between items-start gap-4">
                  <span
                    class="font-serif text-foreground dark:text-white text-base"
                    >{{ offering.label }}</span
                  >
                  <div
                    class="text-right text-[10px] text-foreground/70 dark:text-white/70 space-y-1 mt-1"
                  >
                    <div v-for="price in offering.prices" :key="price.duration">
                      {{ price.duration }} - {{ price.price }}
                    </div>
                  </div>
                </div>
                <div class="h-px w-full border-b border-border mt-2" />
              </div>
            </div>

            <div class="mt-">
              <p class="text-[10px] uppercase text-primary mb-3">
                Available Days
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="day in availableDays"
                  :key="day"
                  class="border border-primary px-2.5 py-1 text-[10px] text-foreground dark:text-white font-semibold"
                >
                  {{ day }}
                </span>
              </div>
            </div>

            <div
              class="mt-6 w-full border border-border bg-[#c9a55a]/10 dark:bg-[#2A2722] px-4 py-4 space-y-3 text-center"
            >
              <p
                class="text-xs text-foreground/80 dark:text-white/80 leading-relaxed"
              >
                Experience any treatment on the left to view details and select
                your preferred duration.
              </p>
            </div>

            <base-button
              to="/membership"
              variant="solid"
              color="primary"
              class="w-full text-sm uppercase mt-6"
            >
              Book This Service
            </base-button>

            <p
              class="text-[10px] text-center text-foreground/50 dark:text-white/50 mt-4"
            >
              We'll confirm your preferred date within 24h.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Scoped styles */
</style>
