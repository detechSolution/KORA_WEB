<script setup lang="ts">
import { useRouter } from "vue-router";
import { useNotification } from "./composables/use-notification";

useSeoMeta({
  title: "Kora | Web",
  description: "Kora",
});
const toasterOptions = { position: "top-right" as const };
</script>

<template>
  <UApp class="bg-background" :toaster="toasterOptions">
    <NuxtLoadingIndicator color="bg-primary" />
    <SplashScreen />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
