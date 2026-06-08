<script setup lang="ts">
import type { Pagination } from "~/composables/use-pagination";
import type { Session } from "~/types/session";

type Props = {
  loading: boolean;
  sessions: {
    data: Session[];
    meta: {
      page: number;
      limit: number;
      total: number;
    };
  };
  pagination: Pagination;
};

withDefaults(defineProps<Props>(), {
  loading: false,
  sessions: () => ({
    data: [] as Session[],
    meta: {
      page: 1,
      limit: 10,
      total: 0,
    },
  }),
  pagination: {} as any,
});

defineEmits(["loadSessionList"]);
</script>

<template>
  <div
    class="max-w-400 mx-auto bg-background dark:bg-secondary-900 w-full px-4 md:px-8 lg:px-12 py-6 select-none relative z-10"
  >
    <div class="mx-auto flex flex-col gap-2">
      <div v-if="loading" class="w-full">
        <div
          class="max-w-400 mx-auto bg-background dark:bg-secondary-900 w-full"
        >
          <class-session-skeleton />
        </div>
      </div>

      <div v-else-if="sessions.data.length">
        <div class="flex flex-col gap-6">
          <ClassSessionCard
            v-for="session in sessions.data"
            :key="session.id"
            :session="session"
          />
        </div>
      </div>

      <div
        v-else
        class="py-20 flex flex-col items-center justify-center text-center gap-4 border border-border/15 bg-background/30 backdrop-blur-md rounded-lg"
      >
        <svg
          class="w-12 h-12 text-primary/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <div class="flex flex-col gap-1">
          <h4 class="font-serif text-xl text-white font-medium">
            No Sessions Available
          </h4>

          <p
            class="font-sans text-xs md:text-sm text-muted-foreground/75 max-w-sm px-4"
          >
            We couldn't find any sessions matching your current selection. Try
            adjusting your filters or check back later for upcoming sessions.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
