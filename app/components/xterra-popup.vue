<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const STORAGE_KEY = "kora-xterra-popup-hidden-permanently";
const CAMPAIGN_START = "2026-11-24";
// November has 30 days, so the requested 28th–31st window ends on Nov 30.
const CAMPAIGN_END = "2026-11-30";

const route = useRoute();
const { success: showSuccess } = useNotification();
const isOpen = ref(false);
const isReservationOpen = ref(false);
const dontShowAgain = ref(false);
const isSubmitting = ref(false);
const submissionMessage = ref("");
const submissionError = ref("");
const reservation = ref({ fullname: "", email: "", phone: "" });
let openTimer: ReturnType<typeof setTimeout> | undefined;

function openReservation() {
  isReservationOpen.value = true;
  submissionMessage.value = "";
  submissionError.value = "";
}

async function submitReservation() {
  if (isSubmitting.value)
    return;

  isSubmitting.value = true;
  submissionError.value = "";
  submissionMessage.value = "";

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbwMIgFk7Znt2jjV3eqzO9FeHUT_RAvlzw_6t5Da_ZFgbqHbvYVVSvV8hSDRrXBQi0BdiQ/exec", {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        name: reservation.value.fullname.trim(),
        email: reservation.value.email.trim(),
        phone: reservation.value.phone.trim(),
        pageUrl: "https://www.koranepal.com",
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok)
      throw new Error("The reservation could not be submitted. Please try again.");

    showSuccess({
      title: "Reservation received",
      message: "Thank you. Your reservation request has been received.",
    });
    reservation.value = { fullname: "", email: "", phone: "" };
    isReservationOpen.value = false;
    dontShowAgain.value = true;
    dismiss();
  }
  catch {
    submissionError.value = "We couldn’t submit your request. Please try again in a moment.";
  }
  finally {
    isSubmitting.value = false;
  }
}

function getKathmanduDate(): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function schedulePopup() {
  if (openTimer)
    clearTimeout(openTimer);
  isOpen.value = false;
  dontShowAgain.value = false;

  if (route.path !== "/")
    return;

  const today = getKathmanduDate();
  if (today < CAMPAIGN_START || today > CAMPAIGN_END)
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
              :src="IMAGES.XTERRA_HERO"
              alt="An athlete swimming through clear blue water"
              class="h-full w-full object-cover object-center"
            >
          </div>

          <div class="flex flex-col justify-center p-6 sm:p-8 md:p-10">
            <p class="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary sm:text-xs">
              KORA × XTERRA NEPAL <span class="px-1 text-white/40">•</span> EXCLUSIVE ATHLETE RECOVERY
            </p>
            <h2
              id="xterra-popup-title"
              class="mb-3 max-w-md font-serif text-3xl leading-tight tracking-wide text-white sm:text-4xl"
            >
              The race is done. Stillness awaits.
            </h2>
            <p class="mb-6 text-sm leading-relaxed text-white/70 sm:text-base">
              As an XTERRA finisher, step into a private day of restoration at KORA. Move at your own pace between cold plunge, sauna, pool, jacuzzi, spa, and our nutrition café with valet parking awaiting your arrival.
            </p>

            <button
              type="button"
              class="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-primary-700 px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-primary-700/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-fit"
              @click="openReservation"
            >
              RESERVE YOUR SPOT
              <UIcon name="i-lucide-arrow-right" class="h-4 w-4 shrink-0" />
            </button>

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

    <Transition name="xterra-popup">
      <div
        v-if="isReservationOpen"
        class="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-6"
        @click.self="isReservationOpen = false"
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="xterra-reservation-title"
          class="relative w-full max-w-md border border-white/15 bg-[#171715] p-6 text-white shadow-2xl sm:p-8"
        >
          <button
            type="button"
            aria-label="Close reservation form"
            class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-white/30 text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-primary"
            @click="isReservationOpen = false"
          >
            <UIcon name="i-lucide-x" class="h-4 w-4" />
          </button>

          <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary sm:text-xs">
            KORA × XTERRA NEPAL
          </p>
          <h2 id="xterra-reservation-title" class="mb-2 font-serif text-3xl tracking-wide">
            Reserve your spot
          </h2>
          <p class="mb-6 text-sm leading-relaxed text-white/65">
            Share your details and our team will be in touch about your day pass.
          </p>

          <form class="space-y-4" @submit.prevent="submitReservation">
            <UFormField
              label="Full name"
              name="fullname"
              required
              :ui="{ label: 'text-white/80', error: 'mt-1 text-red-300 text-xs' }"
            >
              <UInput
                v-model="reservation.fullname"
                required
                autocomplete="name"
                name="fullname"
                placeholder="Your full name"
                size="lg"
                class="w-full"
                :ui="{ base: 'bg-transparent ring-white/20 text-white placeholder:text-white/35 focus:ring-primary rounded-xs h-12' }"
              />
            </UFormField>
            <UFormField
              label="Email"
              name="email"
              required
              :ui="{ label: 'text-white/80', error: 'mt-1 text-red-300 text-xs' }"
            >
              <UInput
                v-model="reservation.email"
                required
                autocomplete="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                size="lg"
                class="w-full"
                :ui="{ base: 'bg-transparent ring-white/20 text-white placeholder:text-white/35 focus:ring-primary rounded-xs h-12' }"
              />
            </UFormField>
            <UFormField
              label="Phone number (optional)"
              name="phone"
              :ui="{ label: 'text-white/80', error: 'mt-1 text-red-300 text-xs' }"
            >
              <UInput
                v-model="reservation.phone"
                autocomplete="tel"
                name="phone"
                type="tel"
                placeholder="Your phone number"
                size="lg"
                class="w-full"
                :ui="{ base: 'bg-transparent ring-white/20 text-white placeholder:text-white/35 focus:ring-primary rounded-xs h-12' }"
              />
            </UFormField>

            <p
              v-if="submissionMessage"
              role="status"
              class="text-sm text-emerald-300"
            >
              {{ submissionMessage }}
            </p>
            <p
              v-if="submissionError"
              role="alert"
              class="text-sm text-red-300"
            >
              {{ submissionError }}
            </p>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-primary-700 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-primary-700/75 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {{ isSubmitting ? "SENDING…" : "SUBMIT RESERVATION" }}
            </button>
          </form>
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
