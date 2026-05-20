<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
    <!-- Main layout Header -->
    <LayoutHeader :is-home="true" class="fixed top-0 left-0 right-0 z-50"/>

    <!-- Main Content Area -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Main layout Footer -->
    <LayoutFooter />
  </div>
</template>
