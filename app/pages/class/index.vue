<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { IMAGES } from "~/utils/images";
import { useSessionStore } from "~/stores/session";
import { usePagination } from "~/composables/use-pagination";
import { getApiErrorMessage } from "~/utils/error";
import { useNotification } from "~/composables/use-notification";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Session Offerings",
  description:
    "Explore curated restorative wellness sessions, mindfulness group classes, sound baths, and therapeutic bodywork offerings.",
});

const loading = ref(false);

const sessionStore = useSessionStore();
const { pagination } = usePagination(2);
const { error: showError } = useNotification();

const route = useRoute();
const router = useRouter();
  
type Tab = "all" | "class" | "workshop" | "event" | "photos";
const activeFilter = ref<Tab>((route.query.tab as Tab) ?? "all");

const filters = [
  // { label: "PHOTOS", value: "photos" },
  { label: "ALL", value: "all" },
  { label: "EVENTS", value: "event" },
  { label: "CLASSES", value: "class" },
  { label: "WORKSHOPS", value: "workshop" },
];
const sessions = computed(() => sessionStore.sessions);

async function getSessionsList() {
  try {
    loading.value = true;
    const params = {
      page: pagination.value.page,
      limit: pagination.value.pageSize,
      type: activeFilter.value === "all" ? undefined : activeFilter.value,
    };
    await sessionStore.getSessions(params);
  } catch (error: unknown) {
    showError({
      message: getApiErrorMessage(error, "Failed to load inquiries"),
    });
  } finally {
    loading.value = false;
  }
}

function handleLoadSessionList(page: number) {
  pagination.value.page = page;
  getSessionsList();
}

onMounted(() => {
  getSessionsList();
});

watch(
  activeFilter,
  (tab) => {
    if (route.path !== "/class") return;
    router.replace({ query: { ...route.query, tab } });
    pagination.value.page = 1;
    getSessionsList();
  },
  { immediate: true }
);

watch(
  () => route.query.tab,
  (tab) => {
    if (route.path !== "/class") return;
    const next = (tab as Tab) ?? "event";
    if (next !== activeFilter.value) activeFilter.value = next;
  }
);
</script>

<template>
  <div
    class="relative w-full bg-background dark:bg-secondary-900 text-[#f4f3f1] min-h-screen pb-16 flex flex-col transition-colors duration-300"
  >
    <div
      class="absolute top-0 right-0 w-64 h-64 md:w-80 md:h-80 aspect-square z-100 -translate-y-12"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage decoration"
        class="w-full h-full object-cover"
      />
    </div>
    <div
      class="absolute top-0 right-0 w-64 h-64 md:w-80 md:h-80 aspect-square z-100 -translate-y-12"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage decoration"
        class="w-full h-full object-cover"
      />
    </div>

    <ClassHeader label="Upcoming Sessions" title="Session Details" />

    <ClassFilter
      v-model="activeFilter"
      :filters="filters"
      class="px-4 md:px-8 lg:px-12"
    />

    <ClassSessionList
      :loading="loading"
      :sessions="sessions"
      :pagination="pagination"
      @load-session-list="handleLoadSessionList"
    />
  </div>
</template>

<style scoped>
@keyframes pageSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.session-animation {
  animation: pageSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
