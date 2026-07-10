<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { ICONS } from "~/config/icons";

const props = defineProps({
  isHome: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: "",
  },
});

const router = useRouter();
const authStore = useAuthStore();
const colorMode = useColorMode();
const userDetail = JSON.parse(localStorage.getItem("user_data") || "{}");

const isDark = computed({
  get: () => colorMode.value === "dark",
  set: (value) => {
    colorMode.preference = value ? "dark" : "light";
  },
});

function toggleColorMode() {
  isDark.value = !isDark.value;
}

const isMenuModalOpen = ref(false);
const isCartOpen = ref(false);
const isSignOutModalOpen = ref(false);
const loadingSignOut = ref(false);

const isScrolled = ref(false);

const SCROLL_THRESHOLD = 30;
let ticking = false;

function updateScrollState() {
  const scrolled = window.scrollY > SCROLL_THRESHOLD;

  if (scrolled !== isScrolled.value) {
    isScrolled.value = scrolled;
  }

  ticking = false;
}

function handleScroll() {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollState);
    ticking = true;
  }
}

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: userDetail.name || "Guest",
      type: "label",
    },
  ],
  [
    {
      label: "My Profile",
      icon: "i-lucide-user",
      onSelect: () => router.push("/profile"),
    },
    {
      label: "Sign Out",
      icon: "i-lucide-log-out",
      onSelect: () => {
        isSignOutModalOpen.value = true;
      },
    },
  ],
]);

const getColorClass = computed(() => {
  const useWhite = props.isHome
    ? !isScrolled.value || isDark.value
    : isDark.value;

  return {
    text: useWhite ? "text-white" : "text-dark",
    image: useWhite ? "/logo/kora_white_logo.svg" : "/logo/kora_black_logo.svg",
  };
});

function handleLogout() {
  authStore.logout();
  isSignOutModalOpen.value = false;
  router.push({ name: "login" });
}

onMounted(() => {
  updateScrollState();

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-1000 w-full px-4 md:px-8 lg:px-12 transition-[padding,box-shadow,border-color] duration-300 ease-out"
    :class="[
      isScrolled
        ? 'py-2 border-b border-border/80 shadow-lg'
        : 'py-3 border-b border-transparent shadow-none',

      props.isHome && !isScrolled
        ? 'bg-transparent'
        : isDark
          ? 'bg-secondary-900/90 backdrop-blur-xl'
          : 'bg-background/90 backdrop-blur-xl',

      props.class,
    ]"
  >
    <div class="max-w-400 h-25 mx-auto flex items-center justify-between">
      <!-- Left: Menu Trigger -->
      <div class="flex-1 flex items-center" :class="getColorClass?.text">
        <button
          class="group flex items-center gap-2.5 hover:text-primary transition-colors duration-200 cursor-pointer py-1.5 focus:outline-none"
          @click="isMenuModalOpen = true"
        >
          <span class="flex flex-col gap-1 w-5">
            <span
              class="h-0.5 w-full bg-current transition-transform duration-200 group-hover:translate-x-0.5"
            />
            <span
              class="h-0.5 w-4 bg-current transition-transform duration-200 group-hover:translate-x-1"
            />
            <span
              class="h-0.5 w-5 bg-current transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </span>
          <span
            class="text-xs md:text-sm font-semibold uppercase tracking-widest font-sans"
          >Menu</span>
        </button>
      </div>

      <!-- Center: Logo -->
      <NuxtLink to="/" class="flex items-center gap-3 focus:outline-none group">
        <img
          :src="getColorClass?.image"
          alt="KORA Logo"
          class="w-12 h-12 md:w-32 md:h-8 object-contain group-hover:scale-105 transition-transform duration-200"
        >
      </NuxtLink>

      <!-- Right: Action items -->
      <div class="flex-1 flex items-center justify-end gap-3 md:gap-4">
        <!-- Wifi Status Button (Replacer of theme toggle) -->
        <!-- Dark Mode Toggle Button -->
        <button
          class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center border border-primary/40 text-primary hover:bg-primary/10 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none"
          title="Toggle Theme"
          @click="toggleColorMode"
        >
          <UIcon
            :name="isDark ? ICONS.SUN : ICONS.MOON"
            class="w-4 h-4 md:w-5 md:h-5"
          />
        </button>

        <!-- Cart Button -->
        <button
          v-if="authStore.isAuthenticated"
          class="flex w-9 h-9 md:w-10 md:h-10 items-center justify-center border border-primary/40 text-primary hover:bg-primary/10 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none"
          title="Cart"
          @click="isCartOpen = true"
        >
          <UIcon
            :name="ICONS.HANDBAG"
            class="w-4 h-4 md:w-5 md:h-5 text-primary"
          />
        </button>

        <!-- Membership CTA Button -->
        <base-button
          to="/membership"
          variant="solid"
          color="primary"
          class="hidden sm:inline-flex px-4 md:px-6 py-2 md:py-2.5 text-[10px] md:text-xs uppercase tracking-widest transition-all duration-200 focus:outline-none shadow-sm active:scale-95"
        >
          Membership
        </base-button>

        <!-- Profile Avatar with premium gold border -->
        <UDropdownMenu
          v-if="authStore.isAuthenticated"
          :modal="false"
          :items="items"
          :content="{
            align: 'end',
            side: 'bottom',
            sideOffset: 8,
          }"
          :ui="{
            content: 'w-50',
          }"
        >
          <UAvatar
            :alt="userDetail.name"
            size="xl"
            loading="lazy"
            class="hover:cursor-pointer"
            :ui="{
              fallback: 'text-secondary-700 dark:text-white',
            }"
          />
        </UDropdownMenu>
        <base-button
          v-else
          to="/login"
          variant="ghost"
          color="primary"
        >
          Login
        </base-button>
      </div>
    </div>
    <!-- commented sidebar for now as replaced by menu modal dont remove this -->
    <!-- <LayoutSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" /> -->
    <LayoutMenuModal
      :is-open="isMenuModalOpen"
      @close="isMenuModalOpen = false"
    />
    <LayoutCartDrawer :is-open="isCartOpen" @close="isCartOpen = false" />
    <profile-signout-modal
      :open="isSignOutModalOpen"
      :loading="loadingSignOut"
      @close="isSignOutModalOpen = false"
      @confirm="handleLogout"
    />
  </header>
</template>
