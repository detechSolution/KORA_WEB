<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
    <!-- Main layout Header -->
    <LayoutHeader />

    <!-- Main Content Area -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Main layout Footer -->
    <LayoutFooter />
  </div>
</template>
