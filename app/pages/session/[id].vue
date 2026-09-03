<script setup lang="ts">
import { useRoute } from "vue-router";
import { createError, navigateTo } from "#imports";
import { useSessionStore } from "~/stores/session";
import { getSessionPath } from "~/utils/session";

definePageMeta({
  layout: "default",
});

const sessionStore = useSessionStore();
const route = useRoute();
const id = String(route.params.id || "");

if (!id) {
  throw createError({
    statusCode: 404,
    statusMessage: "Session not found",
  });
}

const session = await sessionStore.getSessionDetail(id).catch(() => {
  throw createError({
    statusCode: 404,
    statusMessage: "Session not found",
  });
});

await navigateTo(getSessionPath(session.name, id), { redirectCode: 301 });
</script>

<template>
  <div />
</template>
