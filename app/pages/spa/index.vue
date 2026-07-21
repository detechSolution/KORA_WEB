<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "~/composables/use-notification";
import { useAuthStore } from "~/stores/auth";
import { useSpaStore } from "~/stores/spa";
import { getApiErrorMessage } from "~/utils/error";
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

const router = useRouter();
const authStore = useAuthStore();
const spaStore = useSpaStore();
const { error: showError } = useNotification();

const spa = computed(() => spaStore.spa);

const selectedSpa = ref(null);
const isBookingModalOpen = ref(false);
const loading = ref(false);

async function getSpaLists() {
  try {
    loading.value = true;
    await spaStore.getSpas();
  }
  catch (error: unknown) {
    showError({
      message: getApiErrorMessage(error, "Failed to fetch spa lists"),
    });
  }
  finally {
    loading.value = false;
  }
}

function handleBookingClick(spa: any) {
  if (authStore.isAuthenticated) {
    if (authStore.isMembershipFrozen()) {
      showError({
        message: "Your membership is currently frozen. Booking is disabled.",
      });
      return;
    }
    selectedSpa.value = spa;
    isBookingModalOpen.value = true;
  }
  else {
    router.push("/login");
  }
}

function handleOpenBookingModal() {
  if (authStore.isAuthenticated) {
    if (authStore.isMembershipFrozen()) {
      showError({
        message: "Your membership is currently frozen. Booking is disabled.",
      });
      return;
    }
    isBookingModalOpen.value = true;
  }
  else {
    router.push("/login");
  }
}

onMounted(() => {
  getSpaLists();
});
</script>

<template>
  <section
    class="relative bg-background dark:bg-secondary-900 text-foreground dark:text-white transition-colors duration-300 w-full"
  >
    <div
      class="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 xl:w-50 aspect-square z-10 -translate-y-12"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage decoration"
        class="w-full h-full object-cover"
      >
    </div>

    <div class="relative z-10 max-w-400 mx-auto py-12">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        <!-- Left Column -->
        <div>
          <ClassHeader title="Spa Sanctuary" />
          <div
            class="spa-description max-w-400 px-4 md:px-8 lg:px-12 py-10 md:py-7"
            v-html="spa?.description"
          />
          <div class="max-w-400 px-4 md:px-8 lg:px-12 py-10 mb-5 md:py-7">
            <base-section-label
              label="Feature Video"
              align="left"
              class="mb-2"
            />
            <div
              v-if="!isPlayingVideo"
              class="relative overflow-hidden group cursor-pointer"
              @click="isPlayingVideo = true"
            >
              <img
                :src="spa?.bannerUrl"
                :alt="spa?.name"
                class="w-full h-[300px] md:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
              >

              <div
                class="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50"
              />

              <div
                class="absolute top-6 left-6 w-8 h-8 border-t border-l border-primary/70"
              />
              <div
                class="absolute top-6 right-6 w-8 h-8 border-t border-r border-primary/70"
              />
              <div
                class="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-primary/70"
              />
              <div
                class="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-primary/70"
              />

              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-16 h-16 md:w-20 md:h-20 border border-primary/60 flex items-center justify-center bg-black/20 backdrop-blur-sm"
                >
                  <UIcon
                    name="i-lucide-play"
                    class="absolute inset-0 m-auto w-6 h-6 text-primary/80 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>

            <div v-else class="w-full h-[300px] md:h-[460px] bg-black">
              <video
                class="w-full h-full object-cover"
                :src="spa?.videoUrl"
                controls
                autoplay
                preload="metadata"
                playsinline
              />
            </div>
          </div>
          <div class="max-w-400 px-4 md:px-8 lg:px-12 py-10 mb-5 md:py-7">
            <base-section-label
              label="Available Offerings"
              align="left"
              class="mb-4"
            />
            <UAccordion
              :items="spa?.subTypes"
              :ui="{
                item: 'p-6',
              }"
            >
              <template #default="{ item }">
                <div class="flex flex-col">
                  <span>{{ item.name }}</span>
                  <p
                    class="text-sm text-foreground/80 dark:text-secondary-500 mt-4 font-sans"
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
                          `${price.duration} ${price.timeUnit}`
                        }}</span>
                      </div>

                      <p class="text-3xl font-medium text-foreground mt-3">
                        {{ price.price }}
                      </p>
                    </div>

                    <div class="mt-3 flex items-center justify-between">
                      <base-button
                        variant="link"
                        class="text-primary p-0"
                        @click="
                          handleBookingClick({
                            ...price,
                            name: item.name,
                            referenceId: item.id,
                            image: spa?.bannerUrl,
                          })
                        "
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
            <p class="text-[10px] uppercase text-primary mb-3">
              SPA MENU
            </p>
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
                  >{{ subType.name }}</span>
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
              @click="handleOpenBookingModal()"
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
      v-model:selected-spa="selectedSpa"
      :is-open="isBookingModalOpen"
      @close="isBookingModalOpen = false"
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
