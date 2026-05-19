<script setup lang="ts">
definePageMeta({
  layout: "home",
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground font-sans select-none">
    <!-- Modular Hero Section (100vh fold) -->
    <HomeHero />

    <!-- Modular Kora Experience Section (Story, small cards grid) -->
    <HomeExperience />

    <!-- Modular Kora Manifesto Section (Floating staggered cards, quote) -->
    <HomeManifesto />

    <!-- Modular Kora Offerings Section (Alternating showcases, clarity CTA fold) -->
    <HomeOfferings />
  </div>
</template>
