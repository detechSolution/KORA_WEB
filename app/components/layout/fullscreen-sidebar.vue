<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from "vue";
import { useColorMode } from "#imports";
import { useAuthStore } from "~/stores/auth";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

function close() {
  emit("close");
}

const authStore = useAuthStore();
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const logoSrc = computed(() => {
  return isDark.value
    ? "/logo/kora_white_logo.svg"
    : "/logo/kora_black_logo.svg";
});

const menuItems = computed(() => {
  const items = [
    { name: "Class", path: "/session?tab=class", requiresAuth: false },
    { name: "Events", path: "/session?tab=event", requiresAuth: false },
    { name: "Workshops", path: "/session?tab=workshop", requiresAuth: false },
    { name: "Nutrition", path: "/nutrition", requiresAuth: false },
    { name: "Recovery", path: "/recovery", requiresAuth: false },
    { name: "Wellness", path: "/wellness", requiresAuth: false },
    { name: "Schedules", path: "/schedules", requiresAuth: false },
    { name: "Membership", path: "/membership", requiresAuth: false },
    { name: "Spa Sanctuary", path: "/spa", requiresAuth: false },
    { name: "Inquire For Residency", path: "/inquire", requiresAuth: false },
  ];

  return items.filter((item) => {
    if (item.requiresAuth) {
      return authStore.isAuthenticated;
    }
    return true;
  });
});

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape" && props.isOpen) {
    close();
  }
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (typeof document !== "undefined") {
      if (newVal) {
        document.body.style.overflow = "hidden";
      }
      else {
        document.body.style.overflow = "";
      }
    }
  },
  { immediate: true },
);

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] w-full h-screen bg-[#F4F3EF] dark:bg-background flex flex-col overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <!-- Header -->
        <div
          class="w-full flex justify-between items-center px-6 py-6 md:px-12 md:py-8 relative"
        >
          <div class="w-10" />

          <div class="absolute left-1/2 -translate-x-1/2 translate-y-[10px]">
            <NuxtLink
              to="/"
              class="flex items-center gap-3 focus:outline-none group"
            >
              <img
                :src="logoSrc"
                alt="KORA Logo"
                class="w-12 h-12 md:w-32 md:h-8 object-contain group-hover:scale-105 transition-transform duration-200"
              >
            </NuxtLink>
          </div>

          <button
            class="w-10 h-10 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors focus:outline-none group cursor-pointer"
            aria-label="Close menu"
            @click="close"
          >
            <span
              class="relative w-4 h-4 flex items-center justify-center font-light"
            >
              <span
                class="absolute h-[1px] w-full bg-current transform rotate-45 transition-transform duration-300 group-hover:rotate-[135deg]"
              />
              <span
                class="absolute h-[1px] w-full bg-current transform -rotate-45 transition-transform duration-300 group-hover:rotate-[45deg]"
              />
            </span>
          </button>
        </div>

        <div class="grow flex flex-col justify-center py-8">
          <nav class="flex flex-col items-center gap-5 md:gap-7">
            <NuxtLink
              v-for="(item, index) in menuItems"
              :key="item.path"
              :to="item.path"
              class="font-serif text-[18px] md:text-[22px] text-foreground/80 hover:text-primary transition-colors duration-300 focus:outline-none menu-item-animate tracking-wide"
              :style="{ animationDelay: `${100 + index * 50}ms` }"
              @click="close"
            >
              {{ item.name }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.menu-item-animate {
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
