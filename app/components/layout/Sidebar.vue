<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from "vue";

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

// Nuxt color mode
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

// Dynamic brand logo source based on active theme
const logoSrc = computed(() => {
  return isDark.value
    ? "/logo/kora_white_logo.svg"
    : "/logo/kora_black_logo.svg";
});

const menuItems = computed(() => {
  const items = [
    {
      name: "Profile",
      path: "/profile",
      sub: "Your Profile & Wellness Journey",
      requiresAuth: true,
    },
    { name: "Class", path: "/class?tab=class", sub: "Daily Practice & Group Sessions" },
    { name: "Events", path: "/class?tab=event", sub: "Curated Gatherings & Occasions" },
    {
      name: "Workshops",
      path: "/class?tab=workshop",
      sub: "Immersive Learning & Wisdom",
    },
    {
      name: "Nutrition",
      path: "/nutrition",
      sub: "Conscious Culinary Care & Dietary Arts",
    },
    {
      name: "Recovery",
      path: "/recovery",
      sub: "Therapeutic Bodywork & Physical Restoration",
    },
    {
      name: "Wellness",
      path: "/wellness",
      sub: "Holistic Health Coaching & Mindfulness",
    },
    {
      name: "Schedules",
      path: "/schedules",
      sub: "Daily Schedules & Dynamic Programs Calendar",
    },
    {
      name: "Membership",
      path: "/membership",
      sub: "Private Club, Amenities & Collective Benefits",
    },
    {
      name: "Spa Sanctuary",
      path: "/spa",
      sub: "Thermal Hydrotherapy Suites & Treatments",
    },
    {
      name: "Inquire For Residency",
      path: "/inquire",
      sub: "Bespoke Long-Term Sanctuary Villa Living",
    },
  ];

  return items.filter((item) => {
    if (item.requiresAuth) {
      return authStore.isAuthenticated;
    }

    return true;
  });
});

// Close sidebar on Escape key press
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape" && props.isOpen) {
    close();
  }
}

// Lock body scrolling when sidebar is open to preserve visual polish
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
    <!-- Backdrop Overlay -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[4px] transition-opacity cursor-pointer"
        @click="close"
      />
    </Transition>

    <!-- Sidebar Main Panel -->
    <Transition name="slide">
      <div
        v-if="isOpen"
        class="fixed top-0 left-0 bottom-0 z-[101] w-full max-w-[460px] h-screen bg-background border-r border-border/40 shadow-2xl flex flex-col justify-between overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <!-- Panel Header -->
        <div class="px-8 pt-8 pb-4 md:px-12 flex justify-between items-center">
          <NuxtLink
            to="/"
            class="focus:outline-none group"
            @click="close"
          >
            <img
              :src="logoSrc"
              alt="KORA Logo"
              class="w-10 h-10 md:w-28 md:h-8 object-contain transition-transform duration-200 group-hover:scale-105"
            >
          </NuxtLink>

          <!-- Luxury Close Button (Cross elements spin on hover) -->
          <button
            class="group flex items-center justify-center w-10 h-10 rounded-full border border-primary/20 text-foreground hover:border-primary/80 hover:text-primary transition-all duration-300 cursor-pointer focus:outline-none"
            aria-label="Close menu"
            @click="close"
          >
            <span class="relative w-4 h-4 flex items-center justify-center">
              <span
                class="absolute h-[1.5px] w-full bg-current transform rotate-45 transition-transform duration-300 group-hover:rotate-[135deg]"
              />
              <span
                class="absolute h-[1.5px] w-full bg-current transform -rotate-45 transition-transform duration-300 group-hover:rotate-[45deg]"
              />
            </span>
          </button>
        </div>

        <!-- Panel Main Navigation Scroll Area -->
        <div
          class="flex-grow overflow-y-auto px-8 md:px-12 py-4 custom-scrollbar"
        >
          <nav class="flex flex-col gap-1 md:gap-1.5 my-2">
            <div
              v-for="(item, index) in menuItems"
              :key="item.path"
              class="menu-item-animate"
              :style="{ animationDelay: `${100 + index * 50}ms` }"
            >
              <NuxtLink
                :to="item.path"
                class="group flex items-start gap-4 py-3 md:py-3.5 focus:outline-none"
                @click="close"
              >
                <!-- Elegantly tiny serif numbered index -->
                <span
                  class="font-sans text-[10px] md:text-xs tracking-wider text-primary/60 font-semibold pt-1"
                >
                  {{ index + 1 < 10 ? `0${index + 1}` : index + 1 }}
                </span>

                <!-- Text and description with subtle movement on hover -->
                <div
                  class="flex flex-col translate-x-0 group-hover:translate-x-2 transition-transform duration-300 ease-out"
                >
                  <span
                    class="font-serif text-xl md:text-2xl text-foreground font-medium tracking-wide group-hover:text-primary transition-colors duration-300 relative inline-block"
                  >
                    {{ item.name }}
                    <!-- Expanding gold horizontal line -->
                    <span
                      class="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary/70 transition-all duration-300 group-hover:w-full"
                    />
                  </span>
                  <span
                    class="font-sans text-[10px] md:text-xs text-muted-foreground/60 tracking-wider mt-0.5 group-hover:text-foreground/80 transition-colors duration-300"
                  >
                    {{ item.sub }}
                  </span>
                </div>
              </NuxtLink>
            </div>
          </nav>
        </div>

        <!-- Panel Footer -->
        <div
          class="px-8 pb-8 pt-4 md:px-12 border-t border-border/30 bg-background/50 backdrop-blur-md flex flex-col gap-4"
        >
          <!-- Secondary Nav Shortcuts -->
          <div
            class="flex justify-between items-center text-[10px] md:text-xs font-sans tracking-widest text-muted-foreground uppercase font-semibold"
          >
            <a
              href="#"
              class="hover:text-primary transition-colors duration-200"
            >Contact</a>
            <span class="text-border/40">•</span>
            <a
              href="#"
              class="hover:text-primary transition-colors duration-200"
            >Journal</a>
            <span class="text-border/40">•</span>
            <a
              href="#"
              class="hover:text-primary transition-colors duration-200"
            >Location</a>
            <span class="text-border/40">•</span>
            <a
              href="#"
              class="hover:text-primary transition-colors duration-200"
            >Instagram</a>
          </div>

          <!-- Brand Philosophy Note & Copyright -->
          <div
            class="flex justify-between items-center text-[8px] md:text-[9px] font-sans tracking-widest text-muted-foreground/50 uppercase"
          >
            <span>A Sanctuary for Conscious Living</span>
            <span>© 2026 KORA</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Scrollbar detailing */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}

/* Backdrop Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Panel Slide-In Transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Staggered entrance animations for links */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.menu-item-animate {
  opacity: 0;
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
