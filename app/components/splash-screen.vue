<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

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
      />
    </div>
    <span class="text-6xl font-bold text-foreground">KORA</span>
  </div>
</template>

<style scoped>
.loader {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: bounce 1.4s ease-in-out infinite;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

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
