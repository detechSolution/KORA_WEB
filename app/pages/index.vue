<script setup lang="ts">
definePageMeta({
  layout: "home",
});
</script>

<template>
  <div class="min-h-screen bg-[#0D0D0E] text-foreground font-sans select-none">
    <!-- Modular Hero Section (100vh fold) -->
    <HomeHero />

    <!-- Modular Kora Experience Section (Story, small cards grid) -->
    <HomeExperience />

    <!-- Modular Kora Manifesto Section (Floating staggered cards, quote) -->
    <HomeManifesto />
  </div>
</template>
