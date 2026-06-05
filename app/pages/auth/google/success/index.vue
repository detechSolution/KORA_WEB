<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { getHttp } from "~/composables/use-api";
import { useStorage } from "~/composables/use-storage";

definePageMeta({
  layout: false,
  auth: false,
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const http = getHttp();
const storage = useStorage();

const loading = ref(true);
const errorMsg = ref("");

onMounted(async () => {
  try {
    const { accessToken, refreshToken, error: oauthError } = route.query;

    storage.setTokens(accessToken as string, refreshToken as string);

    if (oauthError) {
      errorMsg.value = `Authentication failed: ${oauthError}`;
      loading.value = false;
      return;
    }

    if (!accessToken || !refreshToken) {
      errorMsg.value = "No authorization tokens found.";
      loading.value = false;
      return;
    }

    // Call the backend to exchange the code for tokens

    if (accessToken && refreshToken) {
      storage.setTokens(accessToken as string, refreshToken as string);
      authStore.isAuthenticated = true;
      await authStore.checkAuth(true); // Fetch user details

      router.push("/profile"); // Redirect on success
    } else {
      throw new Error("Invalid tokens received from the server.");
    }
  } catch (error: any) {
    console.error("Google Callback Error:", error);
    errorMsg.value =
      error.data?.message ||
      error.message ||
      "An error occurred during authentication.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div
    class="min-h-screen w-full flex items-center justify-center bg-[#151515] text-white"
  >
    <div v-if="loading" class="text-center">
      <div
        class="i-lucide-loader-2 animate-spin w-8 h-8 mx-auto mb-4 text-[#B59A6D]"
      ></div>
      <p class="text-secondary-400 text-sm">Authenticating with Google...</p>
    </div>

    <div
      v-else-if="errorMsg"
      class="text-center bg-[#252525] p-8 rounded-lg border border-white/5 max-w-md w-full"
    >
      <div class="w-12 h-12 mx-auto mb-4 text-red-500">
        <UIcon name="lucide-x-circle" class="w-full h-full" />
      </div>
      <h2 class="font-serif text-2xl mb-2">Authentication Failed</h2>
      <p class="text-sm text-secondary-400 mb-6">{{ errorMsg }}</p>

      <base-button @click="router.push('/login')" class="w-full">
        BACK TO LOGIN
      </base-button>
    </div>
  </div>
</template>
