<script setup lang="ts">
import { computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "./composables/use-notification";
import { useAuthStore } from "./stores/auth";

useSeoMeta({
  title: "Kora | Web",
  description: "Kora",
});
const toasterOptions = { position: "top-right" as const };
const authStore = useAuthStore();

const { error: showError } = useNotification();

const router = useRouter();

const unAuthorizedError = computed(() => authStore.unAuthorizedError);
const emailVerificationRequired = computed(
  () => authStore.emailVerificationRequired,
);

watch(unAuthorizedError, (unAuthorizedError) => {
  if (unAuthorizedError) {
    authStore.logout();
    showError({ message: "Your session has expired. Please login again." });
    router.push({ name: "login" });
  }
});

watch(emailVerificationRequired, (required) => {
  if (required) {
    authStore.setEmailVerificationRequired(false);
    // showError({ message: "Please verify your email address to continue." });
    router.push({ name: "verify-email" });
  }
});
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
