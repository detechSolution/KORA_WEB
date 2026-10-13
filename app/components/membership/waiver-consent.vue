<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  showError: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const accepted = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

const isWaiverOpen = ref(false);

function openWaiver() {
  isWaiverOpen.value = true;
}

function handleAgree() {
  accepted.value = true;
}
</script>

<template>
  <div>
    <div
      class="border rounded-xs px-4 py-3.5 transition-colors"
      :class="showError && !accepted
        ? 'border-red-500/60 bg-red-500/5'
        : 'border-border/60 bg-card'"
    >
      <UCheckbox
        v-model="accepted"
        :ui="{
          root: 'flex items-start gap-3',
          base: 'mt-0.5 shrink-0 cursor-pointer',
        }"
      >
        <template #label>
          <span class="block text-xs leading-6 text-foreground/80 cursor-pointer">
            I have read and agree to the
            <NuxtLink
              to="/policy"
              target="_blank"
              rel="noopener"
              class="font-semibold text-primary-700 underline underline-offset-2 hover:text-primary"
              @click.stop
            >
              Terms & Policy
            </NuxtLink>
            and the
            <button
              type="button"
              class="font-semibold text-primary-700 underline underline-offset-2 hover:text-primary cursor-pointer"
              @click.stop.prevent="openWaiver"
            >
              Medical & Liability Waiver
            </button>.
          </span>
        </template>
      </UCheckbox>
      <p
        v-if="showError && !accepted"
        role="alert"
        class="mt-2 pl-8 text-xs text-red-600 dark:text-red-400"
      >
        Please read and accept the waiver to continue.
      </p>
    </div>

    <MembershipWaiverModal
      :is-open="isWaiverOpen"
      @close="isWaiverOpen = false"
      @agree="handleAgree"
    />
  </div>
</template>
