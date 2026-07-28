<script setup lang="ts">
import type { PropType } from "vue";
import type { Session } from "~/types/session";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "~/composables/use-notification";
import { useAuthStore } from "~/stores/auth";
import { useSessionStore } from "~/stores/session";

const props = defineProps({
  session: {
    type: Object as PropType<Session>,
    required: true,
  },
});

const emit = defineEmits(["fetchSessionDetail"]);

const authStore = useAuthStore();
const router = useRouter();
const sessionStore = useSessionStore();
const { success, error: showError } = useNotification();

const isPlayingVideo = ref(false);
const isBookingModalOpen = ref(false);
const isAddingToWaitlist = ref(false);

const showWaitlistCta = computed(() => {
  return (
    !props.session.isBooked && !props.session.isInWaitlist && !props.session.isBookable
  );
});

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

async function handleAddToWaitlist() {
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }
  if (authStore.isMembershipFrozen()) {
    showError({
      message: "Your membership is currently frozen. You cannot join the waitlist.",
    });
    return;
  }

  try {
    isAddingToWaitlist.value = true;
    await sessionStore.addToWaitlist(props.session.id);
    emit("fetchSessionDetail");
    success({ message: "Added to waitlist" });
  }
  catch (error: any) {
    showError({ message: error?.message || "Failed to add to waitlist" });
  }
  finally {
    isAddingToWaitlist.value = false;
  }
}
</script>

<template>
  <section
    class="relative bg-background dark:bg-secondary-900 transition-colors duration-300 w-full"
  >
    <div
      class="absolute top-0 right-0 w-50 h-50 md:w-60 md:h-70 xl:w-80 aspect-square z-100 lg:z-10 -translate-y-12"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage decoration"
        class="w-full h-full object-cover"
      >
    </div>

    <div class="relative z-10 max-w-400 mx-auto">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        <div>
          <ClassHeader :title="session.name" />
          <div class="max-w-400 px-4 md:px-8 lg:px-12 py-10 md:py-7">
            <div
              class="session-description text-foreground dark:text-stone-50"
              v-html="session.description"
            />

            <div class="mt-10 text-foreground dark:text-stone-50">
              <h2
                class="font-sans font-bold text-sm uppercase tracking-[0.2em] mb-3"
              >
                Know Your Instructor
              </h2>
              <p
                class="text-sm md:text-[15px] leading-7"
                v-html="session.instructor.bio"
              />
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
                <img
                  :src="session.bannerUrl"
                  :alt="session.name"
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
                  :src="session.videoUrl"
                  controls
                  autoplay
                  preload="metadata"
                  playsinline
                />
              </div>
            </div>

            <div class="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div class="border border-border/60 bg-card/40 px-4 py-4">
                <UIcon
                  name="i-lucide-calendar-days"
                  class="mt-0.5 h-3.5 w-3.5 text-primary"
                />
                <p class="text-xs uppercase text-secondary-500 mb-2">
                  Date
                </p>
                <p class="text-sm text-foreground">
                  {{ formatDate(session.sessionDate) }}
                </p>
              </div>
              <div class="border border-border/60 bg-card/40 px-4 py-4">
                <UIcon
                  name="i-lucide-clock"
                  class="mt-0.5 h-3.5 w-3.5 text-primary"
                />
                <p class="text-xs uppercase text-secondary-500 mb-2">
                  Session Time
                </p>
                <p class="text-sm text-foreground">
                  {{ formatTime(session.startTime) }} -
                  {{ formatTime(session.endTime) }}
                </p>
              </div>
              <div class="border border-border/60 bg-card/40 px-4 py-4">
                <UIcon
                  name="i-lucide-user"
                  class="mt-0.5 h-3.5 w-3.5 text-primary"
                />
                <p class="text-xs uppercase text-secondary-500 mb-2">
                  Instructor
                </p>
                <p class="text-sm text-foreground">
                  {{ session.instructorName }}
                </p>
              </div>
              <div class="border border-border/60 bg-card/40 px-4 py-4">
                <UIcon
                  name="i-lucide-map-pin"
                  class="mt-0.5 h-3.5 w-3.5 text-primary"
                />
                <p class="text-xs uppercase text-secondary-500 mb-2">
                  Location
                </p>
                <p class="text-sm text-foreground">
                  {{ session.venue }}
                </p>
              </div>
            </div>

            <div class="mt-8 flex justify-between items-center">
              <span
                for="seats-left"
                class="text-xs uppercase font-semibold block"
              >
                Occupancy
              </span>
              <span class="text-primary text-xs">
                {{ session.remainingSpots }} spots left
              </span>
            </div>
            <UProgress
              :model-value="session.bookedCount"
              :max="session.capacity"
              class="mt-2"
            />
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
                Rs. {{ session.price }}
              </p>
              <p class="mt-2 text-xs text-secondary-400">
                {{ formatTime(session.startTime) }} -
                {{ formatTime(session.endTime) }} session with
                {{ session.instructorName }}
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
                      {{ formatDate(session.startsAt) }} •
                      {{ formatTime(session.startTime) }} • {{ session.venue }}
                    </p>
                  </div>
                </div>
              </div>

              <base-button
                v-if="session.isBooked && !session.isGuestBookable"
                variant="outline"
                color="primary"
                class="w-full text-sm uppercase"
                disabled
              >
                Already Booked
              </base-button>

              <base-button
                v-else-if="session.isInWaitlist && !session.isBookable"
                variant="outline"
                color="primary"
                class="w-full text-sm uppercase"
                disabled
              >
                Already Waitlisted
              </base-button>

              <base-button
                v-else-if="
                  session.isBookable && session.remainingSpots > 0
                "
                variant="solid"
                color="primary"
                class="w-full text-sm uppercase"
                @click="handleOpenBookingModal"
              >
                Book This Session
              </base-button>

              <base-button
                v-else-if="showWaitlistCta"
                variant="outline"
                color="primary"
                class="w-full text-sm uppercase"
                :loading="isAddingToWaitlist"
                :disabled="isAddingToWaitlist"
                @click="handleAddToWaitlist"
              >
                Add To Waitlist
              </base-button>
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

<style>
.session-description ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.session-description li {
  margin-bottom: 0.5rem;
}
</style>
