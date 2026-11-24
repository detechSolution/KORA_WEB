<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const STORAGE_KEY = "kora-xterra-popup-hidden-permanently";
const EVENT_URL = "https://www.xterraplanet.com/event/xterra-nepal";

const route = useRoute();
const isOpen = ref(false);
const dontShowAgain = ref(false);
let openTimer: ReturnType<typeof setTimeout> | undefined;

function schedulePopup() {
  if (openTimer)
    clearTimeout(openTimer);
  isOpen.value = false;
  dontShowAgain.value = false;

  if (route.path !== "/")
    return;

  try {
    if (localStorage.getItem(STORAGE_KEY) === "true")
      return;
  }
  catch {
    // Show the event popup if browser storage is unavailable.
  }

  openTimer = setTimeout(() => {
    isOpen.value = true;
  }, 900);
}

function dismiss() {
  if (dontShowAgain.value) {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    catch {
      // The popup can still be dismissed when browser storage is unavailable.
    }
  }
  isOpen.value = false;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && isOpen.value)
    dismiss();
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

watch(() => route.path, schedulePopup, { immediate: true });

onBeforeUnmount(() => {
  if (openTimer)
    clearTimeout(openTimer);
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="xterra-popup">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-6"
        @click.self="dismiss"
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="xterra-popup-title"
          class="relative grid w-full max-w-3xl overflow-hidden rounded-sm border border-white/15 bg-[#171715] text-white shadow-2xl md:grid-cols-[0.82fr_1fr]"
        >
          <button
            type="button"
            aria-label="Close event announcement"
            class="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center border border-white/30 bg-black/40 text-white transition hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-primary"
            @click="dismiss"
          >
            <UIcon name="i-lucide-x" class="h-4 w-4" />
          </button>

          <div class="h-36 overflow-hidden sm:h-48 md:h-full md:min-h-[390px]">
            <img
              src="/images/xterra/kora_XTERRA.JPG"
              alt="An athlete swimming through clear blue water"
              class="h-full w-full object-cover object-center"
            >
          </div>

          <div class="flex flex-col justify-center p-6 sm:p-8 md:p-10">
            <p class="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary sm:text-xs">
              XTERRA NEPAL <span class="px-1 text-white/40">·</span> POKHARA <span class="px-1 text-white/40">·</span> 28 NOV 2026
            </p>
            <h2
              id="xterra-popup-title"
              class="mb-3 max-w-md font-serif text-3xl leading-tight tracking-wide text-white sm:text-4xl"
            >
              One wild weekend. One unforgettable place.
            </h2>
            <p class="mb-6 text-sm leading-relaxed text-white/70 sm:text-base">
              Swim Phewa Lake, ride the mountain trails, and run beneath the Himalayas. XTERRA Nepal is coming to Pokhara.
            </p>

            <a
              :href="EVENT_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-primary-700 px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-primary-700/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-fit"
              @click="dismiss"
            >
              Explore the event
              <UIcon name="i-lucide-arrow-up-right" class="h-4 w-4 shrink-0" />
            </a>

            <label class="mt-5 inline-flex w-fit cursor-pointer items-center gap-2.5 text-xs text-white/65">
              <input
                v-model="dontShowAgain"
                type="checkbox"
                class="h-4 w-4 accent-primary-700"
              >
              Don’t show this again
            </label>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.xterra-popup-enter-active,
.xterra-popup-leave-active {
  transition: opacity 180ms ease;
}

.xterra-popup-enter-from,
.xterra-popup-leave-to {
  opacity: 0;
}
</style>
