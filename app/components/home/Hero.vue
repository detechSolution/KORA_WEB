<script setup lang="ts">
import { ref, onMounted } from "vue";

const isLoaded = ref(false);
onMounted(() => {
  // Trigger the elegant fade-in and slow zoom entrance animation
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});
</script>

<template>
  <div class="h-screen w-full relative overflow-hidden bg-stone-950 select-none">
    <!-- Immersive Background Image with Premium Slow-Zoom & Fade Entrance Animation -->
    <img
      :src="IMAGES.HOME_HERO"
      alt="Kora Spa Sanctuary"
      class="absolute inset-0 w-full h-full object-cover transition-all duration-[8000ms] ease-out-quad"
      :class="isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'"
    />

    <!-- Luxury Dark Overlay Layer 1: Top-to-Bottom Linear Gradient (Header Legibility) -->
    <div
      class="absolute inset-x-0 top-0 h-[25vh] bg-gradient-to-b from-stone-950/95 via-stone-950/40 to-transparent pointer-events-none transition-opacity duration-1000 delay-300"
      :class="isLoaded ? 'opacity-100' : 'opacity-0'"
    ></div>

    <!-- Luxury Dark Overlay Layer 2: Bottom-to-Top Linear Gradient (Rich Base Shadow) -->
    <div
      class="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-stone-950/95 via-stone-950/45 to-transparent pointer-events-none transition-opacity duration-1000 delay-300"
      :class="isLoaded ? 'opacity-100' : 'opacity-0'"
    ></div>

    <!-- Luxury Dark Overlay Layer 3: Radial Vignette (Deep Ambient Spa Glow & Center Focus) -->
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_15%,rgba(0,0,0,0.5)_60%,rgba(0,0,0,0.85)_100%)] pointer-events-none transition-opacity duration-1500 delay-200"
      :class="isLoaded ? 'opacity-100' : 'opacity-0'"
    ></div>
  </div>
</template>

<style scoped>
/* High-end custom cubic bezier transition timing */
.ease-out-quad {
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
</style>
