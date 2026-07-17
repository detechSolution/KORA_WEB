<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from "vue";
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

const currentYear = new Date().getFullYear();

const menuItems = computed(() => {
  const items = [
    {
      name: "Profile",
      path: "/profile",
      sub: "Your Profile & Wellness Journey",
      icon: "i-lucide-user",
      requiresAuth: true,
    },
    {
      name: "Class",
      path: "/session?tab=class",
      sub: "Daily Practice & Group Sessions",
      icon: "i-lucide-activity",
    },
    {
      name: "Events",
      path: "/session?tab=event",
      sub: "Curated Gatherings & Occasions",
      icon: "i-lucide-calendar",
    },
    {
      name: "Workshops",
      path: "/session?tab=workshop",
      sub: "Immersive Learning & Wisdom",
      icon: "i-lucide-book-open",
    },
    {
      name: "Nutrition",
      path: "/nutrition",
      sub: "Conscious Culinary Care & Dietary Arts",
      icon: "i-lucide-leaf",
    },
    {
      name: "Recovery",
      path: "/recovery",
      sub: "Therapeutic Bodywork & Physical Restoration",
      icon: "i-lucide-refresh-cw",
    },
    {
      name: "Wellness",
      path: "/wellness",
      sub: "Holistic Health Coaching & Mindfulness",
      icon: "i-lucide-heart",
    },
    {
      name: "Schedules",
      path: "/schedules",
      sub: "Daily Schedules & Dynamic Programs Calendar",
      icon: "i-lucide-clock",
    },
    {
      name: "Membership",
      path: "/membership",
      sub: "Private Club, Amenities & Collective Benefits",
      icon: "i-lucide-users",
    },
    {
      name: "Spa Sanctuary",
      path: "/spa",
      sub: "Thermal Hydrotherapy Suites & Treatments",
      icon: "i-lucide-droplets",
    },
    {
      name: "Inquire For Residency",
      path: "/inquire",
      sub: "Bespoke Long-Term Sanctuary Villa Living",
      icon: "i-lucide-home",
    },
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
        class="fixed inset-0 z-[100] bg-black/60 dark:bg-black/60 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
        @click.self="close"
      >
        <div
          class="bg-background w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-full border border-border"
        >
          <!-- Header -->
          <div
            class="px-8 py-6 flex justify-between items-center border-b border-border"
          >
            <NuxtLink
              to="/"
              class="focus:outline-none"
              @click="close"
            >
              <img
                :src="
                  $colorMode.value === 'dark'
                    ? '/logo/kora_white_logo.svg'
                    : '/logo/kora_black_logo.svg'
                "
                class="w-24 md:w-32 object-contain"
              >
            </NuxtLink>

            <button
              class="w-10 h-10 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 flex items-center justify-center transition-all"
              @click="close"
            >
              <UIcon name="i-lucide-x" class="w-4 h-4" />
            </button>
          </div>

          <!-- Main Content (Grid) -->
          <div class="p-8 overflow-y-auto custom-scrollbar flex-1">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <NuxtLink
                v-for="(item, index) in menuItems"
                :key="item.path"
                :to="item.path"
                class="group bg-card hover:bg-accent/40 dark:hover:bg-white/10 border border-border hover:border-primary/20 rounded-sm p-6 transition-all duration-300 flex items-center justify-between cursor-pointer focus:outline-none"
                @click="close"
              >
                <div class="flex items-start gap-5 flex-1">
                  <div
                    class="w-12 h-12 rounded-full border border-[#A08860]/30 text-[#A08860] flex flex-shrink-0 items-center justify-center group-hover:bg-[#A08860]/10 transition-colors mt-1"
                  >
                    <UIcon :name="item.icon" class="w-5 h-5" />
                  </div>
                  <div class="flex flex-col flex-1">
                    <span
                      class="text-primary font-sans text-[10px] font-semibold tracking-wider mb-1"
                    >
                      {{ index + 1 < 10 ? `0${index + 1}` : index + 1 }}
                    </span>
                    <h3
                      class="text-foreground font-serif text-lg tracking-wide group-hover:text-primary transition-colors mb-1"
                    >
                      {{ item.name }}
                    </h3>
                    <p
                      class="text-muted-foreground text-[11px] font-sans tracking-wide leading-relaxed pr-2"
                    >
                      {{ item.sub }}
                    </p>
                  </div>
                </div>
                <UIcon
                  name="i-lucide-chevron-right"
                  class="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0"
                />
              </NuxtLink>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="px-8 py-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div
              class="flex justify-between w-full md:w-auto md:gap-8 items-center text-[9px] font-sans tracking-widest text-muted-foreground uppercase order-2 md:order-1"
            >
              <span>A Sanctuary for Conscious Living</span>
            </div>

            <div
              class="flex flex-wrap justify-center items-center gap-4 text-[10px] md:text-xs font-sans tracking-widest text-foreground/70 uppercase font-semibold order-1 md:order-2"
            >
              <NuxtLink
                to="/inquire"
                class="hover:text-foreground dark:hover:text-white transition-colors"
                @click="close"
              >
                Contact
              </NuxtLink>

              <span class="text-border">•</span>

              <NuxtLink
                to="https://maps.app.goo.gl/tdZ2HmcEsGvnTDLf9?g_st=ic"
                target="_blank"
                class="hover:text-foreground dark:hover:text-white transition-colors"
              >
                Location
              </NuxtLink>

              <span class="text-border">•</span>

              <a
                href="https://www.instagram.com/lifeatkora/"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-foreground dark:hover:text-white transition-colors"
              >
                Instagram
              </a>
            </div>

            <div
              class="flex justify-between w-full md:w-auto md:gap-8 items-center text-[9px] font-sans tracking-widest text-muted-foreground uppercase order-3"
            >
              <span>© {{ currentYear }} KORA</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
</style>
