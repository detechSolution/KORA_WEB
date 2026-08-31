<script setup lang="ts">
type Props = {
  open: boolean;
  serviceName?: string;
  loading?: boolean;
};

withDefaults(defineProps<Props>(), {
  serviceName: "",
  loading: false,
});

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm"): void;
}>();
</script>

<template>
  <base-modal
    :open="open"
    title="Cancel This Booking?"
    description=""
    :modal-width="420"
    dismissible
    @close="emit('close')"
  >
    <div class="flex flex-col gap-5">
      <p class="text-sm text-secondary-500">
        Your reservation will be permanently canceled. Are you sure you want to cancel this booking?
      </p>

      <div class="flex justify-end gap-2">
        <base-button
          variant="outline"
          class="w-full"
          @click="emit('close')"
        >
          Keep
        </base-button>

        <base-button
          variant="solid"
          :loading="loading"
          :disabled="loading"
          class="cursor-pointer font-semibold w-full bg-red-900 dark:bg-red-900 hover:bg-red-900/75 dark:hover:bg-red-900/75 text-white"
          @click="emit('confirm')"
        >
          Cancel
        </base-button>
      </div>
    </div>
  </base-modal>
</template>
