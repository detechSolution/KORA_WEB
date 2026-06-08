<script setup lang="ts">
import { useRoute } from "vue-router";
import { createError, useAsyncData } from "#imports";
import { useSessionStore } from "~/stores/session";

definePageMeta({
  layout: "default",
});

const sessionStore = useSessionStore();
const route = useRoute();
const id = String(route.params.id || "");

const { data: session, pending } = await useAsyncData(`session-${id}`, async () => {
  const existing = sessionStore.getSessionById(id);
  if (existing)
    return existing;

  try {
    return await sessionStore.getSessionDetail(id);
  }
  catch (e) {
    throw createError({ statusCode: 404, statusMessage: "Session not found" });
  }
});

if (!session.value) {
  throw createError({ statusCode: 404, statusMessage: "Session not found" });
}

useSeoMeta({
  title: () => `Kora | ${session.value?.name ?? "Session Detail"}`,
  description: () => session.value?.description ?? "Kora session detail",
});
</script>

<template>
  <div v-if="pending" class="flex justify-center items-center min-h-[60vh]">
    <UIcon name="i-lucide-loader-2" class="w-10 h-10 animate-spin text-primary/70" />
  </div>
  <ClassSessionDetailView v-else-if="session" :session="session" />
</template>
