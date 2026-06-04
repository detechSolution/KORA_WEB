<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { Booking } from "~/data/profile";

const props = defineProps<{
  booking: Booking;
}>();

const router = useRouter();

const badgeClass = computed(() => {
  if (props.booking.type === "Session") {
    return "bg-[#3D1E62] text-[#D8B4FE]"; // Purple
  } else if (props.booking.type === "Spa") {
    return "bg-[#1B3B36] text-[#6EE7B7]"; // Teal/Green
  } else if (props.booking.type === "Pass") {
    return "bg-[#1E3A8A] text-[#93C5FD]"; // Blue
  }
  return "bg-stone-800 text-stone-300";
});

const handleViewDetail = (booking: Booking) => {
  // Implement navigation to detail page or modal
  console.log("View details for booking:", booking);
  if (booking.itemType === "spa") {
    router.push({ path: `/spa` });
  } else if (booking.itemType === "session") {
    router.push({ path: `/class/${booking.sessionId}` });
  } else if (booking.itemType === "passes") {
    router.push({ path: `/membership` });
  }
};
</script>

<template>
  <div
    class="flex flex-col sm:flex-row justify-between py-6 border-b border-border gap-6 group transition-colors"
  >
    <!-- Left side: Image and details -->
    <div class="flex flex-col sm:flex-row gap-6">
      <!-- Thumbnail (Image or Icon) -->
      <div
        v-if="booking.type === 'Pass'"
        class="w-24 h-24 border border-stone-800 bg-[#1A1A1A] flex flex-col items-center justify-center rounded-sm shrink-0"
      >
        <!-- Pass Icon -->
        <UIcon name="i-lucide-badge" class="w-8 h-8 text-[#B59A6D]" />
      </div>
      <div
        v-else
        class="w-24 h-24 rounded-sm overflow-hidden bg-stone-900 shrink-0"
      >
        <img
          v-if="booking.image"
          :src="booking.image"
          :alt="booking.title"
          class="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
        />
      </div>

      <!-- Details -->
      <div class="flex flex-col justify-center">
        <!-- Title and Badge -->
        <div class="flex items-center gap-3 mb-3">
          <h4 class="font-serif text-xl text-foreground font-normal">
            {{ booking.title }}
          </h4>
          <span
            :class="[
              'px-2 py-0.5 text-[10px] font-bold rounded-sm',
              badgeClass,
            ]"
          >
            {{ booking.type }}
          </span>
        </div>

        <!-- Date / Time / Location -->
        <div
          v-if="booking.type !== 'Pass'"
          class="flex flex-wrap items-center gap-4 text-xs text-stone-400 font-light"
        >
          <div class="flex items-center gap-1.5" v-if="booking.date">
            <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
            {{ booking.date }}
          </div>
          <div class="flex items-center gap-1.5" v-if="booking.time">
            <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
            {{ booking.time }}
          </div>
          <div class="flex items-center gap-1.5" v-if="booking.location">
            <UIcon name="i-lucide-map-pin" class="w-3.5 h-3.5" />
            {{ booking.location }}
          </div>
        </div>

        <!-- Description (For passes) -->
        <div v-else class="text-xs text-stone-400 font-light">
          {{ booking.description }}
        </div>
      </div>
    </div>

    <!-- Right side: Price & Buttons -->
    <div
      class="flex flex-col justify-between sm:items-end gap-6 sm:gap-0 mt-4 sm:mt-0"
    >
      <div class="font-serif text-xl text-[#B59A6D] self-end">
        {{ booking.price }}
      </div>

      <div class="flex items-center gap-3 self-end">
        <base-button
          variant="outline"
          class="bg-transparent text-red-700 dark:text-red-800 border-red-700 dark:border-red-800 ring-none h-8 text-xs dark:hover:text-red-800 font-medium"
        >
          CANCEL REQUEST
        </base-button>

        <base-button
          v-if="booking.type !== 'Pass'"
          variant="outline"
          class="h-8 text-xs font-medium"
          @click="handleViewDetail(booking)"
        >
          VIEW DETAIL
          <UIcon name="i-lucide-arrow-up-right" class="w-3.5 h-3.5" />
        </base-button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
