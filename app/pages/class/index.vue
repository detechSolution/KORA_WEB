<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { IMAGES } from "~/utils/images";
import { sessionCollection } from "~/data/sessions";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Session Offerings",
  description:
    "Explore curated restorative wellness sessions, mindfulness group classes, sound baths, and therapeutic bodywork offerings.",
});

const colorMode = useColorMode();

onMounted(() => {
  if (colorMode.value !== "dark") {
    colorMode.preference = "dark";
  }
});

const activeFilter = ref("all");
const sessions = sessionCollection;

const filteredSessions = computed(() => {
  if (activeFilter.value === "all") {
    return sessions;
  }

  const filteredData = sessions.data.filter(
    (s) => s.category === activeFilter.value,
  );

  return {
    ...sessions,
    data: filteredData,
    meta: {
      ...sessions.meta,
      total: filteredData.length,
    },
  };
});
</script>

<template>
  <div
    class="relative w-full bg-background dark:bg-secondary-900 text-[#f4f3f1] min-h-screen pb-16 flex flex-col transition-colors duration-300 overflow-hidden"
  >
    <!-- Premium absolute-positioned foliage watermark overlay -->
    <div
      class="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 xl:w-90 aspect-square pointer-events-none select-none z-10000 translate-x-25 -translate-y-12 rotate-[20deg]"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage decoration"
        class="w-full h-full object-contain"
      />
    </div>

    <ClassHeader label="Upcoming Sessions" title="Session Details"/>

    <ClassFilter v-model="activeFilter" />

    <div class="w-full">
      <div v-if="activeFilter !== 'photos'">
        <ClassSessionList :sessions="filteredSessions" />
      </div>

      <div
        v-else
        class="w-full px-4 md:px-8 lg:px-12 py-6 select-none relative z-10"
      >
        <div class="max-w-400 mx-auto">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-4"
          >
            <div
              v-for="(session, index) in sessions.data"
              :key="session.id"
              class="group relative overflow-hidden aspect-square border border-border/10 shadow-lg cursor-pointer bg-muted hover:border-primary/50 transition-colors duration-300"
              :style="{ animationDelay: `${index * 80}ms` }"
            >
              <img
                :src="session.image"
                :alt="session.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div
                class="absolute inset-0 bg-black/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5"
              >
                <span
                  class="text-primary text-[8px] md:text-[9px] tracking-[0.2em] font-bold uppercase"
                >
                  {{ session.tagLabel || session.category }}
                </span>
                <h4
                  class="font-serif text-lg text-white font-medium mt-1 leading-snug"
                >
                  {{ session.title }}
                </h4>
                <p
                  class="font-sans text-[10px] text-muted-foreground/90 mt-1 line-clamp-2"
                >
                  {{ session.description }}
                </p>
                <div
                  class="flex items-center justify-between text-[9px] tracking-wider text-primary mt-3 border-t border-border/20 pt-2.5 uppercase font-bold"
                >
                  <span>{{ session.price }}</span>
                  <span>View Details</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

.max-w-400 {
  animation: pageSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
