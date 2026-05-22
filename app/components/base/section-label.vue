<script setup lang="ts">
defineProps<{
  label: string
  align?: "left" | "center" | "right"
}>()
</script>

<template>
  <div
    class="flex items-center w-full gap-3"
    :class="{
      'justify-start': align === 'left',
      'justify-center': align === 'center',
      'justify-end': align === 'right'
    }"
  >
    <!-- Left line -->
    <div
      v-if="align !== 'left'"
      class="flex-1 h-px border border-border"
    />

    <!-- Text -->
    <span
      class="md:text-sm uppercase text-primary-700 font-semibold whitespace-nowrap"
    >
      {{ label }}
    </span>

    <!-- Right line -->
    <div
      v-if="align !== 'right'"
      class="flex-1 h-px border border-border"
    />
  </div>
</template>