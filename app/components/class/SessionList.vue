<script setup lang="ts">
import { computed, watch } from "vue";
import type { PropType } from "vue";
import { usePagination } from "~/composables/use-pagination";
import type { SessionDetail } from "~/data/sessions";

const props = defineProps({
  sessions: {
    type: Object as PropType<{
      data: SessionDetail[];
      meta: {
        total: number;
      };
    }>,
    required: true,
  },
});

const { pagination, resetPagination } = usePagination(2);

// Watch for changes in sessions prop (e.g., filter changed) to reset page to 1
watch(
  () => props.sessions,
  () => {
    resetPagination();
  },
  { deep: true }
);

// Compute the slice of sessions to display based on the active page
const paginatedSessions = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return props.sessions.data.slice(start, end);
});

const emit = defineEmits(["loadSessionList"]);
</script>

<template>
  <div
    class="max-w-400 mx-auto bg-background dark:bg-secondary-900 w-full px-4 md:px-8 lg:px-12 py-6 select-none relative z-10"
  >
    <div class="mx-auto flex flex-col gap-2">
      <!-- Session Cards List -->
      <div v-if="sessions.data.length !== 0" class="flex flex-col gap-6">
        <ClassSessionCard
          v-for="session in paginatedSessions"
          :key="session.id"
          :session="session"
        />
        <base-pagination
          :page="pagination.page"
          :total="sessions?.meta?.total"
          :items-per-page="pagination.pageSize"
          @update:page="
            (v) => {
              pagination.page = v;
              emit('loadSessionList');
            }
          "
        />
      </div>

      <!-- Graceful Empty State Fallback -->
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
            No Sessions Offered
          </h4>
          <p
            class="font-sans text-xs md:text-sm text-muted-foreground/75 max-w-sm px-4"
          >
            There are currently no sessions available under this category.
            Please check back later or select another filter.
          </p>
        </div>
      </div>

      <!-- Pagination Section (matching screenshot layout) -->
    </div>
  </div>
</template>
