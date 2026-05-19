<script setup lang="ts">
import { onMounted } from 'vue'

// Force dark mode for the premium immersive experience
const colorMode = useColorMode()
onMounted(() => {
  colorMode.preference = 'dark'
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
    <!-- Main layout Header - Absolutely positioned to overlay the hero image -->
    <LayoutHeader class="absolute top-0 left-0 right-0 z-50 w-full" />

    <!-- Main Content Area -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Main layout Footer -->
    <LayoutFooter />
  </div>
</template>
