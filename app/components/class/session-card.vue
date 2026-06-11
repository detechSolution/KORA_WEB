<script setup lang="ts">
import type { PropType } from "vue";
import type { Session } from "~/types/session";

defineProps({
  session: {
    type: Object as PropType<Session>,
    required: true,
  },
});
</script>

<template>
  <div
    class="bg-transparent group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10 py-10 border-b border-border last:border-b-0 w-full"
  >
    <div
      class="relative w-full sm:w-auto md:w-[260px] lg:w-[300px] shrink-0 aspect-[1.15] overflow-hidden border-primary bg-muted select-none z-10 shadow-lg"
    >
      <img
        :src="session.bannerUrl"
        :alt="session.name"
        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      >
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15 opacity-70 group-hover:opacity-40 transition-opacity duration-500"
      />
    </div>

    <div class="grow flex flex-col items-start gap-1 py-1">
      <base-badge
        color="primary"
        class="rounded-xs text-stone-900 dark:text-white uppercase"
      >
        {{ session.type }}
      </base-badge>

      <span
        class="flex items-center gap-1.5 text-[10px] md:text-xs font-sans tracking-wide text-primary mt-2 select-none"
      >
        <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5 text-primary" />
        {{ formatDate(session.startsAt) }}
      </span>

      <h3
        class="font-serif text-2xl md:text-3xl text-black dark:text-white font-normal tracking-wide mt-2 mb-2 select-none transition-colors duration-300"
      >
        {{ session.name }}
      </h3>

      <div
        class="font-sans text-xs md:text-sm text-secondary-400 leading-relaxed max-w-2xl mb-3 line-clamp-2 overflow-hidden"
        v-html="session.description"
      />

      <div
        class="flex items-center gap-5 text-[10px] md:text-xs text-secondary-300 dark:text-secondary-400 font-sans mt-1 select-none"
      >
        <span class="flex items-center gap-1.5">
          <UIcon name="i-lucide-clock" class="w-3.5 h-3.5 text-primary/60" />
          {{ formatTime(session.startTime) }} -
          {{ formatTime(session.endTime) }}
        </span>
        <span class="flex items-center gap-1.5">
          <UIcon name="i-lucide-users" class="w-3.5 h-3.5 text-primary/60" />
          {{ session.remainingSpots }}
        </span>
      </div>
    </div>

    <div
      class="w-full md:w-auto flex md:flex-col justify-between md:justify-center items-start md:items-end gap-3 min-w-[160px] pt-4 md:pt-0 border-t border-border/10 md:border-none select-none shrink-0"
    >
      <div class="flex flex-col justify-center items-start md:items-end gap-3">
        <span
          class="font-sans text-[8px] md:text-[9px] text-primary/70 tracking-[0.2em] uppercase font-bold"
        >
          PER SESSION
        </span>
        <span
          class="font-serif text-2xl md:text-3xl text-black dark:text-white font-normal leading-none tracking-wide"
        >
          Rs. {{ session.price }}
        </span>
      </div>

      <base-button
        variant="outline"
        color="primary"
        :to="{ path: `/session/${session.id}`, query: {} }"
      >
        View Detail
        <UIcon
          name="i-lucide-arrow-up-right"
          class="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
        />
      </base-button>
    </div>
  </div>
</template>
