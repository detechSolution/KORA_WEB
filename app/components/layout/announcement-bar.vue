<script setup lang="ts">
// Shared visibility state across layouts so dismissal persists on navigation
const announcementVisible = useState("announcement-bar-visible", () => true);

function dismiss() {
  announcementVisible.value = false;
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out overflow-hidden"
    enter-from-class="opacity-0 max-h-0"
    enter-to-class="opacity-100 max-h-16"
    leave-active-class="transition-all duration-200 ease-in overflow-hidden"
    leave-from-class="opacity-100 max-h-16"
    leave-to-class="opacity-0 max-h-0"
  >
    <div
      v-if="announcementVisible"
      class="relative w-full border-b border-primary/20 announcement-bar"
      role="banner"
      aria-label="Site announcement"
    >
      <div
        class="relative max-w-400 mx-auto px-4 md:px-8 lg:px-12 pr-10 sm:pr-4"
      >
        <!-- Mobile layout: 2-line stacked -->
        <div class="flex sm:hidden flex-col items-start justify-center h-14 gap-0.5">
          <!-- Line 1: Opening Soon -->
          <span class="text-[9px] font-semibold tracking-[0.22em] uppercase text-primary-800 leading-none">
            Opening Soon
          </span>
          <!-- Line 2: Location + CTA -->
          <div class="flex items-center justify-between w-full gap-2">
            <span class="text-[9px] font-medium tracking-[0.15em] uppercase text-foreground/70 leading-none">
              Hattigauda, Kathmandu
            </span>
            <NuxtLink
              to="/inquire"
              class="shrink-0 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-primary underline underline-offset-2 active:scale-95 transition-all duration-200 whitespace-nowrap focus:outline-none"
            >
              Request Priority Access
              <UIcon name="i-lucide-arrow-right" class="w-3 h-3" />
            </NuxtLink>
          </div>
        </div>

        <!-- Desktop layout: single row -->
        <div class="hidden sm:flex items-center justify-center h-9 gap-4">
          <p class="text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase text-foreground text-center leading-none">
            <span class="text-primary-800">Opening Soon</span>
            <span class="mx-2">·</span>
            <span>Hattigauda, Kathmandu</span>
            <span class="mx-2">—</span>
            <span class="text-secondary-400">Priority Access &amp; Launch Updates Open</span>
          </p>
          <NuxtLink
            to="/inquire"
            class="underline underline-offset-3 shrink-0 inline-flex items-center gap-1.5 px-3 py-1 border-0 text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.18em] active:scale-95 transition-all duration-200 whitespace-nowrap focus:outline-none"
          >
            Request Priority Access
            <UIcon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>
      </div>

      <!-- Dismiss button -->
      <button
        class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-foreground/40 hover:text-foreground/80 transition-colors duration-200 cursor-pointer focus:outline-none"
        aria-label="Dismiss announcement"
        @click="dismiss"
      >
        <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
      </button>
    </div>
  </Transition>
</template>

<style>
.announcement-bar {
  background:
    radial-gradient(ellipse 85% 100% at 40% 0%, rgba(171, 140, 92, 0.5) 0%, transparent 50%),
    linear-gradient(to bottom, #ffffff 0%, #ffffff 100%);
}

.dark .announcement-bar {
  background:
    radial-gradient(ellipse 85% 100% at 50% 0%, rgba(171, 140, 92, 0.25) 0%, transparent 70%),
    linear-gradient(to bottom, #171513 0%, #111113 100%);
}
</style>
