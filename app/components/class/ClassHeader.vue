<script setup lang="ts">
import { useSlots } from "vue";
type Props = {
  label?: string;
  title: string;
};

defineProps<Props>();

const slots = useSlots();
</script>
<template>
  <div
    class="bg-background dark:bg-secondary-900 relative w-full pb-6 select-none"
  >
    <!-- Heading content wrapper -->
    <div
      class="relative z-10 max-w-400 mx-auto px-4 md:px-8 lg:px-12 flex flex-col gap-2"
    >
      <span
        v-if="label"
        class="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-primary-700"
      >
        {{ label }}
      </span>
      <h1
        class="font-serif text-3xl md:text-5xl lg:text-6xl text-black dark:text-white font-normal tracking-wide"
      >
        {{ title }}
      </h1>
      <div class="h-px w-full border-b border-border mt-8" />

      <!-- Description -->
      <div v-if="slots.default" class="mt-8">
        <slot />
        <div class="h-px w-full border-b border-border mt-8" />
      </div>
    </div>
  </div>
</template>
