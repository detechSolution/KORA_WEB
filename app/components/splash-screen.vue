<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

const isLoading = ref(true);
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(val) {
    colorMode.preference = val ? "dark" : "light";
  },
});

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
</script>

<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 z-9999 flex flex-row items-center justify-center gap-4 bg-background"
  >
    <div class="heart">
      <img
        :src="
          isDark ? '/logo/white_icon_logo.svg' : '/logo/black_icon_logo.svg'
        "
        alt="KORA Logo"
        class="w-12 h-12 md:w-16 md:h-16 object-contain"
      >
    </div>
    <span class="text-6xl font-thin text-foreground">KORA</span>
  </div>
</template>

<style scoped>
.heart {
  animation: beat 0.5s infinite alternate;
  transform-origin: center;
}

@keyframes beat {
  to {
    transform: scale(1.4);
  }
}
</style>
