<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { getSessionBySlug } from "~/data/sessions";

definePageMeta({
  layout: "default",
});

const route = useRoute();

const slug = computed(() => String(route.params.slug || ""));
const session = computed(() => getSessionBySlug(slug.value));

if (!session.value) {
  throw new Error("Session not found");
}

useSeoMeta({
  title: () => `Kora | ${session.value?.title ?? "Session Detail"}`,
  description: () => session.value?.description ?? "Kora session detail",
});
</script>

<template>
  <ClassSessionDetailView :session="session" />
</template>
