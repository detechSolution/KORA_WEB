<script setup lang="ts">
const props = defineProps({
  filters: {
    type: Array as () => { label: string; value: string }[],
    default: () => [],
  },
  modelValue: {
    type: String,
    default: "all",
  },
  class: {
    type: String,
    default: "",
  },
  buttonClass: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

function selectFilter(val: string) {
  emit("update:modelValue", val);
}
</script>

<template>
  <div
    class="bg-transparent w-full py-4 select-none z-10 relative"
  >
    <div
      :class="props.class"
      class="max-w-400 mx-auto flex items-center justify-start gap-3 md:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1"
    >
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="px-4 md:px-5 py-2 font-sans tracking-[0.2em] font-semibold border uppercase transition-all duration-300 cursor-pointer focus:outline-none whitespace-nowrap"
        :class="[
          props.buttonClass || 'text-[9px] md:text-xs',
          modelValue === filter.value
            ? 'bg-primary-700 border-primary-700 text-white shadow-md active:scale-95'
            : 'border-stone-300 dark:border-stone-700 text-black dark:text-white/70 hover:border-primary/60 hover:text-primary hover:bg-primary/5 active:scale-95',
        ]"
        @click="selectFilter(filter.value)"
      >
        {{ filter.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar for standard browsers but support scrolling */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
