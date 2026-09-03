<script setup lang="ts">
import type { Booking } from "~/data/profile";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "~/composables/use-notification";
import { useMemberStore } from "~/stores/member";
import { getApiErrorMessage } from "~/utils/error";
import { getSessionPath } from "~/utils/session";

const props = defineProps<{
  booking: Booking;
  activeTab: string;
}>();

const emit = defineEmits(["fetchBookings"]);

const router = useRouter();
const { success, error: showError } = useNotification();
const memberstore = useMemberStore();

const isCancelRequestModalOpen = ref(false);
const loadingCancelRequest = ref(false);

const badgeClass = computed(() => {
  if (props.booking.itemType === "session") {
    return "bg-[#3D1E62] text-[#D8B4FE]"; // Purple
  }
  else if (props.booking.itemType === "spa") {
    return "bg-[#1B3B36] text-[#6EE7B7]"; // Teal/Green
  }
  else if (props.booking.itemType === "passes") {
    return "bg-[#1E3A8A] text-[#93C5FD]"; // Blue
  }
  return "bg-stone-800 text-stone-300";
});

function handleViewDetail(booking: Booking) {
  if (booking.itemType === "spa") {
    router.push({ path: `/spa` });
  }
  else if (booking.itemType === "session") {
    if (!booking.productId)
      return;

    router.push({ path: getSessionPath(booking.title, booking.productId) });
  }
  else if (booking.itemType === "passes") {
    router.push({ path: `/membership` });
  }
}

async function handleCancelRequest() {
  if (!props.booking)
    return;

  try {
    loadingCancelRequest.value = true;

    await memberstore.requestBookingCancellation(props.booking.id);

    success({ message: "Cancellation requested successfully" });

    emit("fetchBookings");
  }
  catch (err: unknown) {
    showError({
      message: getApiErrorMessage(
        err,
        "Failed to request booking cancellation",
      ),
    });
  }
  finally {
    loadingCancelRequest.value = false;
    isCancelRequestModalOpen.value = false;
  }
}
</script>

<template>
  <div
    class="flex flex-col sm:flex-row justify-between py-6 border-b border-border gap-6 group transition-colors"
  >
    <!-- Left side: Image and details -->
    <div class="flex flex-col sm:flex-row gap-6">
      <!-- Thumbnail (Image or Icon) -->
      <!-- <div
        v-if="booking.itemType === 'passes'"
        class="w-24 h-24 border border-border dark:bg-[#1A1A1A] flex flex-col items-center justify-center rounded-xs shrink-0"
      >
        <UIcon
          name="i-lucide-id-card-lanyard"
          class="w-12 h-12 text-[#B59A6D]"
        />
      </div>
      <div
        v-else
        class="w-24 h-24 rounded-xs overflow-hidden bg-stone-900 shrink-0"
      >
        <img
          v-if="booking.image"
          :src="booking.image"
          :alt="booking.title"
          class="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
        >
      </div> -->

      <!-- Details -->
      <div>
        <span
          v-if="booking.visitors"
          class="py-0.5 text-[10px] font-bold rounded-sm capitalize text-primary"
        >
          {{ booking.visitors.length > 0 ? `GUEST X ${booking.visitors.length}` : 'MYSELF' }}
        </span>
        <div class="flex flex-col justify-center">
          <!-- Title and Badge -->
          <div class="flex items-center gap-3 mb-3">
            <h4 class="font-serif text-xl text-foreground font-normal">
              {{ booking.title }}
            </h4>
            <span
              class="px-2 py-0.5 text-[10px] font-bold rounded-sm capitalize"
              :class="[badgeClass]"
            >
              {{ booking.itemType }}
            </span>
          </div>

          <!-- Date / Time / Location -->
          <div
            v-if="booking.type !== 'Pass'"
            class="flex flex-wrap items-center gap-4 text-xs text-stone-400 font-light"
          >
            <div v-if="booking.date" class="flex items-center gap-1.5">
              <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
              {{ booking.date }}
            </div>
            <!-- <div v-if="booking.time" class="flex items-center gap-1.5">
            <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
            {{ booking.time }}
          </div> -->
            <div v-if="booking.location" class="flex items-center gap-1.5">
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
    </div>

    <!-- Right side: Price & Buttons -->
    <div
      class="flex flex-col justify-between sm:items-end gap-6 sm:gap-0 mt-4 sm:mt-0"
    >
      <div class="font-serif text-xl text-[#B59A6D] self-end">
        {{ booking.price }}
      </div>

      <div
        v-if="activeTab.toLowerCase() === 'upcoming'"
        class="w-full md:w-auto flex items-center gap-3 self-end"
      >
        <span
          v-if="booking.refundStatus === 'requested'"
          class="text-sm text-stone-400 font-medium px-2 py-1"
        >
          Cancel Requested
        </span>
        <template v-else>
          <base-button
            variant="outline"
            class="w-full md:w-auto bg-transparent text-red-700 dark:text-red-800 border-red-700 dark:border-red-800 ring-none h-8 text-xs dark:hover:text-red-800 font-medium"
            @click="isCancelRequestModalOpen = true"
          >
            CANCEL
          </base-button>

          <base-button
            v-if="booking.type !== 'Pass'"
            variant="outline"
            class="w-full md:w-auto h-8 text-xs font-medium"
            @click="handleViewDetail(booking)"
          >
            VIEW
            <UIcon name="i-lucide-arrow-up-right" class="w-3.5 h-3.5" />
          </base-button>
        </template>
      </div>
    </div>
  </div>
  <profile-request-cancel-modal
    :open="isCancelRequestModalOpen"
    :loading="loadingCancelRequest"
    @close="isCancelRequestModalOpen = false"
    @confirm="handleCancelRequest"
  />
</template>

<style scoped></style>
