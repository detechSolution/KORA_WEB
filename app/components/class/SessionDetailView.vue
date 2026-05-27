<script setup lang="ts">
import { ref } from "vue";
import type { PropType } from "vue";
import { useRouter } from "vue-router";
import type { SessionDetail } from "~/data/sessions";
import { useAuthStore } from "~/stores/auth";

defineProps({
  session: {
    type: Object as PropType<SessionDetail>,
    required: true,
  },
});

const authStore = useAuthStore();
const router = useRouter();

const isPlayingVideo = ref(false);
const isBookingModalOpen = ref(false);

const handleOpenBookingModal = () => {
  if (authStore.isAuthenticated) {
    isBookingModalOpen.value = true;
  } else {
    router.push("/login");
  }
};
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
      />
    </div>

    <div class="relative z-10 max-w-400 mx-auto">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        <div>
          <ClassHeader :title="session.title" />
          <div class="max-w-400 px-4 md:px-8 lg:px-12 py-10 md:py-7">
            <div class="space-y-5 text-sm md:text-[15px] leading-7">
              <p v-for="paragraph in session.overview" :key="paragraph">
                {{ paragraph }}
              </p>
            </div>

            <div class="mt-10">
              <h2
                class="font-sans font-bold text-sm uppercase tracking-[0.2em] mb-4"
              >
                What To Expect
              </h2>
              <ul class="space-y-2 text-sm md:text-[15px] leading-7">
                <li
                  v-for="expectation in session.expectations"
                  :key="expectation"
                  class="flex gap-3"
                >
                  <span
                    class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black dark:bg-white"
                  ></span>
                  <span>{{ expectation }}</span>
                </li>
              </ul>
            </div>

            <div class="mt-10">
              <h2
                class="font-sans font-bold text-sm uppercase tracking-[0.2em] mb-3"
              >
                Know Your Instructor
              </h2>
              <p class="text-sm md:text-[15px] leading-7">
                {{ session.facilitatorBio }}
              </p>
            </div>

            <div class="mt-12">
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
                <!-- Image -->
                <img
                  :src="session.supportImage || session.image"
                  :alt="session.title"
                  class="w-full h-[300px] md:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <!-- Dark Overlay -->
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

            <div class="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div class="border border-border/60 bg-card/40 px-4 py-4">
                <UIcon
                  name="i-lucide-calendar-days"
                  class="mt-0.5 h-3.5 w-3.5 text-primary"
                />
                <p class="text-xs uppercase text-secondary-500 mb-2">Date</p>
                <p class="text-sm text-foreground">{{ session.date }}</p>
              </div>
              <div class="border border-border/60 bg-card/40 px-4 py-4">
                <UIcon
                  name="i-lucide-calendar-days"
                  class="mt-0.5 h-3.5 w-3.5 text-primary"
                />
                <p class="text-xs uppercase text-secondary-500 mb-2">
                  Session Time
                </p>
                <p class="text-sm text-foreground">{{ session.time }}</p>
              </div>
              <div class="border border-border/60 bg-card/40 px-4 py-4">
                <UIcon
                  name="i-lucide-calendar-days"
                  class="mt-0.5 h-3.5 w-3.5 text-primary"
                />
                <p class="text-xs uppercase text-secondary-500 mb-2">
                  Facilitator
                </p>
                <p class="text-sm text-foreground">{{ session.facilitator }}</p>
              </div>
              <div class="border border-border/60 bg-card/40 px-4 py-4">
                <UIcon
                  name="i-lucide-calendar-days"
                  class="mt-0.5 h-3.5 w-3.5 text-primary"
                />
                <p class="text-xs uppercase text-secondary-500 mb-2">
                  Location
                </p>
                <p class="text-sm text-foreground">{{ session.location }}</p>
              </div>
            </div>

            <div class="mt-8 flex justify-between items-center">
              <span
                for="seats-left"
                class="text-xs uppercase font-semibold block"
              >
                Seats Left
              </span>
              <span class="text-primary text-xs">12 / 19</span>
            </div>
            <UProgress v-model="session.id" class="mt-2" />
          </div>
        </div>

        <!-- Book Your Spot Section -->
        <aside class="sticky lg:top-28 lg:self-start px-4 md:px-8 lg:px-0">
          <div class="border border-border bg-card">
            <div class="px-5 py-5 md:px-6">
              <p
                class="text-[10px] uppercase tracking-[0.24em] text-primary/70 mb-3"
              >
                Book Your Spot
              </p>
              <p
                class="font-serif text-3xl md:text-4xl text-foreground leading-none"
              >
                {{ session.price }}
              </p>
              <p class="mt-2 text-xs text-secondary-400">
                {{ session.duration }} session with free tea service
              </p>
            </div>

            <div class="px-5 py-5 md:px-6 space-y-4 flex flex-col items-center">
              <div
                class="w-full border border-border bg-[#c9a55a]/10 dark:bg-[#2A2722] px-4 py-4 space-y-3"
              >
                <div class="flex gap-3 text-sm">
                  <UIcon
                    name="i-lucide-calendar-days"
                    class="mt-0.5 h-3.5 w-3.5 text-primary"
                  />
                  <div>
                    <p class="text-[10px] text-secondary-400 mb-1">
                      Session Starting Date & Time
                    </p>
                    <p class="text-foreground font-medium">
                      {{ session.date }} • {{ session.time }} •
                      {{ session.location }}
                    </p>
                  </div>
                </div>
              </div>

              <base-button
                @click="handleOpenBookingModal"
                variant="solid"
                color="primary"
                class="w-full text-sm uppercase"
              >
                Book This Session
              </base-button>

              <span class="text-secondary-400 text-xs">
                No instant payment required to reserve
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <ClassSessionBookingModal
      :is-open="isBookingModalOpen"
      :session="session"
      @close="isBookingModalOpen = false"
    />
  </section>
</template>
