<script setup lang="ts"></script>

<template>
  <div
    class="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300"
  >
    <!-- Top Chrome: Announcement Bar + Sticky Header -->
    <div class="sticky top-0 inset-x-0 z-1000">
      <LayoutAnnouncementBar />
      <LayoutHeader :is-home="false" />
    </div>

    <!-- Main Content Area -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Main layout Footer -->
    <LayoutFooter />
  </div>
</template>
