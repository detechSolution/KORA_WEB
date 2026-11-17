<script setup lang="ts">
import { computed } from "vue";
import { formatDate } from "~/utils/format";

const props = defineProps<{
  isOpen: boolean;
  startsOn?: string;
  endsOn?: string;
}>();

const emit = defineEmits<{
  accept: [];
  cancel: [];
}>();

const period = computed(() => {
  if (!props.startsOn || !props.endsOn)
    return "the frozen period";
  return `${formatDate(props.startsOn)} – ${formatDate(props.endsOn)}`;
});
</script>

<template>
  <base-modal
    title="Membership freeze"
    :open="isOpen"
    :modal-width="520"
    :dismissible="false"
  >
    <div class="p-6 md:p-8">
      <p class="text-sm leading-relaxed text-secondary-500">
        This booking is during your membership freeze ({{ period }}). If you continue and complete payment, your frozen membership period will be released. If you cancel the booking or payment, your membership will remain frozen.
      </p>
      <div class="mt-8 flex justify-end gap-3">
        <base-button variant="outline" @click="emit('cancel')">
          CANCEL
        </base-button>
        <base-button @click="emit('accept')">
          CONTINUE TO PAYMENT
        </base-button>
      </div>
    </div>
  </base-modal>
</template>
