<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  layout: false,
});

const route = useRoute();
const router = useRouter();

const errorMessage = computed(() => {
  return route.query.message || "An unknown error occurred during Google authentication.";
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#151515] text-white p-4">
    <div class="max-w-md w-full bg-[#252525] p-8 rounded-lg border border-white/10 text-center">
      <div class="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-alert-triangle" class="w-8 h-8" />
      </div>
      <h1 class="text-2xl font-serif mb-2">
        Authentication Failed
      </h1>
      <p class="text-secondary-400 mb-6">
        {{ errorMessage }}
      </p>

      <base-button class="w-full" @click="router.push('/login')">
        Back to Login
      </base-button>
    </div>
  </div>
</template>
