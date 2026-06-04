<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { IMAGES } from "~/utils/images";
import { useSpaStore } from "~/stores/spa";
import { getApiErrorMessage } from "~/utils/error";
import { useNotification } from "~/composables/use-notification";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Spa Sanctuary",
  description:
    "Experience true relaxation with our curated spa offerings including massages and therapies.",
});

const isPlayingVideo = ref(false);
const isBookingModalOpen = ref(false);
const loading = ref(false);

const spa = computed(() => spaStore.spa);

const spaStore = useSpaStore();
const { error: showError } = useNotification();
const selectedSpa = ref(null);

async function getSpaLists() {
  try {
    loading.value = true;
    await spaStore.getSpas();
  } catch (error: unknown) {
    showError({
      message: getApiErrorMessage(error, "Failed to fetch spa lists"),
    });
  } finally {
    loading.value = false;
  }
}

const handleBookingClick = (spa: any) => {
  selectedSpa.value = spa;
  isBookingModalOpen.value = true;
};

onMounted(() => {
  getSpaLists();
});
</script>

<template>
  <section
    class="relative bg-background dark:bg-secondary-900 text-foreground dark:text-white transition-colors duration-300 w-full"
  >
    <!-- Premium absolute-positioned foliage watermark overlay -->
    <div
      class="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 xl:w-50 aspect-square z-10 -translate-y-12"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage decoration"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="relative z-10 max-w-400 mx-auto py-12">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        <!-- Left Column -->
        <div>
          <ClassHeader title="Spa Sanctuary" />
          <div
            v-html="spa?.description"
            class="spa-description max-w-400 px-4 md:px-8 lg:px-12 py-10 md:py-7"
          ></div>
          <div class="max-w-400 px-4 md:px-8 lg:px-12 py-10 mb-5 md:py-7">
            <base-section-label
              label="Available Offerings"
              align="left"
              class="mb-4"
            />
            <UAccordion
              :items="spa?.subTypes"
            >
              <template #default="{ item }">
                <div class="flex flex-col">
                  <span>{{ item.name }}</span>
                  <p
                    class="text-sm text-foreground/80 dark:text-secondary-500 mt-4"
                  >
                    {{ item.description }}
                  </p>
                </div>
              </template>
              <template #content="{ item }">
                <!-- Pricing Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div
                    v-for="(price, index) in item.prices"
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
                          price.duration + " " + price.timeUnit
                        }}</span>
                      </div>

                      <p class="text-3xl font-medium text-foreground mt-3">
                        {{ price.price }}
                      </p>
                    </div>

                    <div class="mt-3 flex items-center justify-between">
                      <base-button
                        @click="
                          handleBookingClick({
                            ...price,
                            name: item.name,
                            referenceId: item.id,
                            image: spa?.bannerUrl,
                          })
                        "
                        variant="link"
                        class="text-primary p-0"
                      >
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
            <p class="text-[10px] uppercase text-primary mb-3">SPA MENU</p>
            <h3
              class="font-serif text-3xl text-foreground dark:text-white mb-8"
            >
              {{ spa?.subTypes.length || 0 }} Offerings Available
            </h3>

            <div v-if="spa?.subTypes.length" class="space-y-6">
              <div v-for="subType in spa.subTypes" :key="subType.id">
                <div class="flex justify-between items-center gap-4">
                  <span
                    class="font-serif text-foreground dark:text-white text-base"
                    >{{ subType.name }}</span
                  >
                  <div
                    class="text-right text-[10px] text-secondary-500 font-normal dark:text-white/70 space-y-1 mt-1"
                  >
                    <div v-for="price in subType.prices" :key="price.duration">
                      {{ price.duration }} {{ price.timeUnit }} -
                      {{ price.price }}
                    </div>
                  </div>
                </div>
                <div class="h-px w-full border-b border-border mt-2" />
              </div>
            </div>

            <div class="mt-6">
              <p class="text-[10px] uppercase text-primary mb-3">
                Available Days
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="day in spa?.availableDays"
                  :key="day"
                  class="border border-primary uppercase px-2.5 py-1 text-[10px] text-foreground dark:text-white font-semibold"
                >
                  {{ day }}
                </span>
              </div>
            </div>

            <div
              class="mt-6 w-full border border-border bg-[#c9a55a]/10 dark:bg-[#2A2722] px-4 py-4 space-y-3 text-center"
            >
              <p
                class="text-xs text-start text-secondary-500 dark:text-white/80 leading-relaxed"
              >
                Experience any treatment on the left to view details and select
                your preferred duration.
              </p>
            </div>

            <base-button
              variant="solid"
              color="primary"
              class="w-full text-sm font-semibold uppercase mt-6"
              @click="isBookingModalOpen = true"
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

    <SpaBookingModal
      v-if="isBookingModalOpen"
      :is-open="isBookingModalOpen"
      @close="isBookingModalOpen = false"
      v-model:selected-spa="selectedSpa"
    />
  </section>
</template>

<style>
.spa-description ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}

.spa-description ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.spa-description li {
  margin-bottom: 0.5rem;
}
</style>
