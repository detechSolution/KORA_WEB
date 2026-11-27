<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
    <!-- Top Chrome: Announcement Bar + Fixed Header -->
    <div class="fixed top-0 inset-x-0 z-1000">
      <LayoutAnnouncementBar />
      <LayoutHeader :is-home="true" />
    </div>

    <!-- Main Content Area -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Main layout Footer -->
    <LayoutFooter />
  </div>
</template>
