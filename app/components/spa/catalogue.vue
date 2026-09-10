<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotification } from "~/composables/use-notification";
import { useAuthStore } from "~/stores/auth";
import { useSpaStore } from "~/stores/spa";
import { getApiErrorMessage } from "~/utils/error";
import { formatPrice } from "~/utils/format";
import { IMAGES } from "~/utils/images";

const props = withDefaults(defineProps<{ gifting?: boolean }>(), { gifting: false });
const emit = defineEmits<{ gift: [] }>();

const isPlayingVideo = ref(false);

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const spaStore = useSpaStore();
const { error: showError } = useNotification();

const {
  spa,
  categories,
  selectedCategoryId,
  selectedCategory,
  categoryServices,
  categoriesLoading,
  categoryLoading,
  categoriesError,
  categoryError,
} = storeToRefs(spaStore);
const categoryItems = computed(() => categoryServices.value.map(item => ({
  ...item,
  value: String(item.id),
})));

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

function handleOpenBookingModal() {
  if (props.gifting) {
    emit("gift");
    return;
  }
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
    router.push({ path: "/login", query: { redirect: route.fullPath } });
  }
}

onMounted(() => {
  getSpaLists();
  spaStore.getCategories();
});
</script>

<template>
  <section
    class="relative bg-background dark:bg-secondary-900 text-foreground dark:text-white transition-colors duration-300 w-full"
  >
    <div
      v-if="!gifting"
      class="pointer-events-none absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 xl:w-50 aspect-square z-10 -translate-y-12"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage decoration"
        class="w-full h-full object-cover"
      >
    </div>

    <div class="relative z-10 max-w-400 mx-auto" :class="gifting ? 'py-6' : 'py-12'">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-0">
        <!-- Left Column -->
        <div>
          <ClassHeader title="Spa Sanctuary" />
          <div
            v-if="spa?.description"
            class="spa-description max-w-400 px-4 md:px-8 lg:px-12 py-10 md:py-7"
            v-html="spa?.description"
          />
          <p v-if="!spa?.description" class="px-4 md:px-8 lg:px-12 pt-7 text-sm text-secondary-500 leading-relaxed">
            Discover a quieter pace at Spa Sanctuary. Explore our massages, facials and body rituals, thoughtfully designed to help you relax and feel refreshed.
          </p>
          <div class="max-w-400 px-4 md:px-8 lg:px-12 pt-7 pb-8">
            <base-section-label
              label="Feature Video"
              align="left"
              class="mb-2"
            />
            <div
              v-if="!isPlayingVideo"
              class="relative overflow-hidden group"
            >
              <img
                :src="spa?.bannerUrl || IMAGES.WELLNESS_SPA"
                :alt="spa?.name || 'Spa Sanctuary'"
                class="w-full aspect-[1.93/1] object-cover transition-transform duration-700 group-hover:scale-105"
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

              <button
                v-if="spa?.videoUrl"
                type="button"
                aria-label="Play spa feature video"
                class="absolute inset-0 flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:-outline-offset-2"
                @click="isPlayingVideo = true"
              >
                <span
                  class="w-16 h-16 md:w-20 md:h-20 border border-primary/60 flex items-center justify-center bg-black/20 backdrop-blur-sm"
                >
                  <UIcon
                    name="i-lucide-play"
                    class="absolute inset-0 m-auto w-6 h-6 text-primary/80 transition-transform duration-300 group-hover:scale-110"
                  />
                </span>
              </button>
            </div>

            <div v-else class="w-full aspect-[1.93/1] bg-black">
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
          <div class="max-w-400 px-4 md:px-8 lg:px-12 pb-8">
            <base-section-label
              label="Available Offerings"
              align="left"
              class="mb-4"
            />
            <p
              v-if="categoriesLoading && !categories.length"
              role="status"
              class="py-5 text-sm text-secondary-500"
            >
              Loading spa categories...
            </p>
            <div
              v-else-if="categoriesError"
              role="alert"
              class="py-5 space-y-3"
            >
              <p class="text-sm text-secondary-500">
                {{ categoriesError }}
              </p>
              <base-button variant="outline" @click="spaStore.getCategories()">
                Retry categories
              </base-button>
            </div>
            <p v-else-if="!categories.length" class="py-5 text-sm text-secondary-500">
              No spa categories are currently available.
            </p>
            <div
              v-if="categories.length"
              class="grid grid-cols-2 sm:grid-cols-3 gap-3"
              role="group"
              aria-label="Spa categories"
            >
              <button
                v-for="category in categories"
                :key="category.id"
                type="button"
                :aria-pressed="selectedCategoryId === category.id"
                aria-controls="spa-category-offerings"
                class="border bg-card px-3 py-3 text-center transition-colors cursor-pointer hover:border-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                :class="selectedCategoryId === category.id ? 'border-primary bg-primary/5' : 'border-border'"
                @click="spaStore.selectCategory(category.id)"
              >
                <span class="block font-serif text-base">{{ category.name }}</span>
                <span class="block mt-1 font-sans text-xs text-secondary-500">
                  {{ category.servicesCount }} {{ category.servicesCount === 1 ? 'Service' : 'Services' }}
                </span>
              </button>
            </div>

            <section
              v-if="selectedCategory"
              id="spa-category-offerings"
              aria-labelledby="spa-category-title"
              :aria-busy="categoryLoading"
              class="mt-7 border-t border-border pt-7"
            >
              <h2
                id="spa-category-title"
                class="font-serif text-2xl mb-4"
                aria-live="polite"
              >
                {{ selectedCategory?.name || 'Spa Offerings' }}
              </h2>
              <p
                v-if="categoryLoading"
                role="status"
                class="py-5 text-sm text-secondary-500"
              >
                Loading treatments...
              </p>
              <div
                v-else-if="categoryError"
                role="alert"
                class="py-5 space-y-3"
              >
                <p class="text-sm text-secondary-500">
                  {{ categoryError }}
                </p>
                <base-button variant="outline" @click="spaStore.selectCategory(selectedCategory.id)">
                  Retry treatments
                </base-button>
              </div>
              <UAccordion
                v-else-if="categoryItems.length"
                :key="selectedCategoryId"
                :items="categoryItems"
                label-key="name"
                :ui="{
                  root: 'space-y-3',
                  item: 'border-0 bg-card px-5 md:px-6',
                  trigger: 'py-5 cursor-pointer hover:no-underline focus-visible:outline-primary',
                  trailingIcon: 'text-primary size-4 self-start mt-1',
                }"
              >
                <template #default="{ item }">
                  <span class="block font-serif text-lg">{{ item.name }}</span>
                  <span class="flex flex-wrap gap-x-6 gap-y-2 mt-2 font-sans text-xs font-normal text-secondary-500">
                    <span
                      v-for="price in item.prices"
                      :key="price.id"
                      class="whitespace-nowrap"
                    >
                      <span class="text-primary">{{ price.duration }} {{ price.timeUnit }}</span>
                      <span class="ml-1.5 text-sm">{{ item.currency === 'NPR' ? 'Rs.' : item.currency }} {{ formatPrice(price.price) }}</span>
                    </span>
                  </span>
                </template>
                <template #content="{ item }">
                  <p class="pb-5 text-sm font-sans text-secondary-500 leading-relaxed">
                    {{ item.description }}
                  </p>
                </template>
              </UAccordion>
              <p v-else class="text-sm text-secondary-500 py-5">
                No treatments are currently available in this category.
              </p>
            </section>
          </div>
        </div>

        <!-- Right Column (Sidebar) -->
        <aside class="lg:sticky lg:top-30 lg:self-start px-4 md:px-8 lg:px-0">
          <div class="border border-border bg-card px-5 py-5 md:px-6">
            <h3
              class="font-serif text-3xl text-foreground dark:text-white mb-8"
            >
              Spa Offerings
            </h3>
            <div class="mt-6">
              <p class="text-[10px] uppercase text-primary mb-3">
                Available Days
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="day in spa?.availableDays ?? ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']"
                  :key="day"
                  class="border border-primary uppercase px-2.5 py-1 text-[10px] text-foreground dark:text-white font-semibold"
                >
                  {{ day }}
                </span>
              </div>
            </div>

            <div
              class="hidden lg:block mt-6 w-full border border-border bg-[#c9a55a]/10 dark:bg-[#2A2722] px-4 py-4 space-y-3 text-center"
            >
              <p
                class="text-xs text-start text-secondary-500 dark:text-white/80 leading-relaxed"
              >
                Expand any treatment to view its description, and explore the available durations and prices.
              </p>
            </div>

            <base-button
              variant="solid"
              color="primary"
              class="w-full text-sm font-semibold uppercase mt-6"
              :disabled="gifting ? categoryLoading || !categoryServices.length : loading || !spa?.subTypes?.length"
              @click="handleOpenBookingModal()"
            >
              {{ gifting ? 'Gift Spa Service' : 'Book Spa Service' }}
            </base-button>
          </div>
        </aside>
      </div>
    </div>

    <SpaBookingModal
      v-if="!gifting && isBookingModalOpen"
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
