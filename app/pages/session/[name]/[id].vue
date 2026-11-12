<script setup lang="ts">
import { useRoute } from "vue-router";
import { createError, useAsyncData } from "#imports";
import { useSessionStore } from "~/stores/session";
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

const sessionStore = useSessionStore();
const route = useRoute();
const id = String(route.params.id || "");

const {
  data: session,
  pending,
  refresh,
} = await useAsyncData(`session-${id}`, async () => {
  try {
    return await sessionStore.getSessionDetail(id);
  }
  catch (error) {
    console.error(`Failed to fetch session detail for ${id}:`, error);
    throw createError({
      statusCode: 404,
      statusMessage: "Page not found",
    });
  }
});

if (!session.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
  });
}

async function fetchSessionDetail() {
  await refresh();
}

useSeoMeta({
  title: () => `Kora | ${session.value?.name ?? "Session Detail"}`,
  description: () => session.value?.description ?? "Kora session detail",
});
</script>

<template>
  <div v-if="pending" class="flex justify-center items-center min-h-[60vh]">
    <UIcon
      name="i-lucide-loader-2"
      class="w-10 h-10 animate-spin text-primary/70"
    />
  </div>

  <ClassSessionDetailView
    v-else-if="session"
    :session="session"
    @fetch-session-detail="fetchSessionDetail"
  />

  <!-- Fallback branded 'Page not found' view with link to the schedule -->
  <div
    v-else
    class="relative w-full min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center select-none overflow-hidden"
  >
    <div
      class="absolute top-0 right-0 w-50 md:w-60 lg:w-80 aspect-square z-10 -translate-y-12 pointer-events-none"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage decoration"
        class="w-full h-full object-cover"
      >
    </div>

    <span
      class="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-primary mb-3"
    >
      404 Error
    </span>
    <h1
      class="font-serif text-3xl md:text-5xl text-foreground font-normal tracking-wide mb-4"
    >
      Page Not Found
    </h1>
    <p
      class="font-sans text-sm md:text-base text-secondary-400 max-w-md mx-auto mb-8 leading-relaxed"
    >
      We couldn't find the session you're looking for. The link may be broken or the session may have been moved.
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <base-button
        to="/schedules"
        variant="solid"
        color="primary"
        class="uppercase text-xs tracking-wider"
      >
        View Schedule
      </base-button>
      <base-button
        to="/session"
        variant="outline"
        color="primary"
        class="uppercase text-xs tracking-wider"
      >
        Upcoming Sessions
      </base-button>
    </div>
  </div>
</template>
