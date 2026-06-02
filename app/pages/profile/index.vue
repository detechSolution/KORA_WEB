<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { IMAGES } from "~/utils/images";
import { mockBookings } from "~/data/profile";
import { useAuthStore } from "~/stores/auth";
import { useMemberStore } from "~/stores/member";
import { useRouter } from "vue-router";
import { formatDate } from "~/utils/format";

definePageMeta({
  auth: true,
  layout: "default",
});

useSeoMeta({
  title: "Kora | Profile",
  description: "View and manage your Kora profile and bookings.",
});

const authStore = useAuthStore();
const memberStore = useMemberStore();
const router = useRouter();

onMounted(async () => {
  await memberStore.getDashboard();
});

const dashboardData = computed(() => memberStore.dashboardData);
const profileData = computed(() => dashboardData.value?.profile);
const summaryData = computed(() => dashboardData.value?.summary);
const membershipData = computed(() => dashboardData.value?.membership);

const user = computed(() => {
  return {
    name: profileData.value?.fullName || "",
    initials: profileData.value?.initials || "",
    email: profileData.value?.email || "",
    phone: profileData.value?.phoneNumber || "",
    memberSince: formatDate(profileData.value?.memberSince ?? ""),
    isMember: membershipData.value?.isActive || false,
    membership: {
      name: membershipData.value?.planName || "",
      subtitle: "",
      period: membershipData.value?.frequencyLabel || "",
      tier: membershipData.value?.planName || "",
      billing: membershipData.value
        ? `${membershipData.value.currency} ${membershipData.value.price}/${membershipData.value.frequencyLabel.toLowerCase()}`
        : "",
      benefit: membershipData.value?.memberBenefitPercent
        ? `${membershipData.value.memberBenefitPercent}% off`
        : "",
    },
    stats: {
      totalBookings: summaryData.value?.totalBookings || 0,
      upcoming: summaryData.value?.upcomingBookings || 0,
      canceled: summaryData.value?.cancelledBookings || 0,
    },
  };
});

const bookings = ref(mockBookings);

const activeTab = ref("UPCOMING");

const isSignOutModalOpen = ref(false);
const loadingSignOut = ref(false);

const filteredBookings = computed(() => {
  return bookings.value.filter((b) => b.status === activeTab.value);
});

// Update the tab counts dynamically based on bookings data
const tabs = computed(() => {
  const pastCount = summaryData.value?.pastBookings || 0;

  return [
    { value: "UPCOMING", label: `UPCOMING (${user.value.stats.upcoming})` },
    { value: "PAST", label: `PAST (${pastCount})` },
    { value: "CANCELED", label: `CANCELED (${user.value.stats.canceled})` },
  ];
});

function handleLogout(): void {
  authStore.logout();
  isSignOutModalOpen.value = false;
  router.push({ name: "login" });
}
</script>

<template>
  <div
    class="relative bg-background dark:bg-secondary-900 text-foreground dark:text-white min-h-screen pt-16 overflow-hidden font-sans"
  >
    <!-- Premium absolute-positioned foliage watermark overlay (Right) -->
    <div
      class="absolute top-0 right-0 w-76 h-76 xl:w-80 xl:h-80 pointer-events-none select-none z-0 opacity-20 dark:opacity-30"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage right"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="relative z-10 max-w-400 mx-auto mb-20 px-4 md:px-8 lg:px-12">
      <!-- Top Header / User Info -->
      <div
        class="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12"
      >
        <!-- Avatar -->
        <div
          class="w-24 h-24 bg-[#B59A6D] text-white flex items-center justify-center text-3xl font-serif rounded-sm shadow-sm shrink-0"
        >
          {{ user.initials }}
        </div>

        <!-- Details -->
        <div class="flex flex-col">
          <div class="flex items-center gap-4 mb-2">
            <h1
              class="font-serif text-4xl md:text-5xl font-normal tracking-wide text-foreground"
            >
              {{ user.name }}
            </h1>
            <span
              v-if="user.isMember"
              class="px-2.5 py-1 bg-[#C9A55A1A] text-primary-700 border border-[#C9A55A26] text-xs tracking-[0.15em] uppercase rounded-xs flex items-center gap-1.5"
            >
              <UIcon name="i-lucide-award" class="w-3 h-3" />
              KORA MEMBER
            </span>
          </div>
          <div
            class="flex flex-wrap items-center gap-6 text-sm text-stone-400 font-light"
          >
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-mail" class="w-4 h-4" />
              {{ user.email }}
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-phone" class="w-4 h-4" />
              {{ user.phone }}
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <!-- Card 1 -->
        <div
          class="bg-card border border-border rounded-sm p-6 flex flex-col justify-between h-28"
        >
          <div
            class="flex items-center gap-2 text-[10px] font-normal tracking-widest uppercase text-stone-400"
          >
            <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5 bg-primary" />
            TOTAL BOOKINGS
          </div>
          <div class="font-serif text-3xl text-foreground">
            {{ user.stats.totalBookings }}
          </div>
        </div>
        <!-- Card 2 -->
        <div
          class="bg-card border border-border rounded-sm p-6 flex flex-col justify-between h-28"
        >
          <div
            class="flex items-center gap-2 text-[10px] font-normal tracking-widest uppercase text-stone-400"
          >
            <UIcon name="i-lucide-clock" class="w-3.5 h-3.5 bg-primary" />
            UPCOMING
          </div>
          <div class="font-serif text-3xl text-foreground">
            {{ user.stats.upcoming }}
          </div>
        </div>
        <!-- Card 3 -->
        <div
          class="bg-card border border-border rounded-sm p-6 flex flex-col justify-between h-28"
        >
          <div
            class="flex items-center gap-2 text-[10px] font-normal tracking-widest uppercase text-stone-400"
          >
            <UIcon name="i-lucide-x-square" class="w-3.5 h-3.5 bg-primary" />
            CANCELED BOOKINGS
          </div>
          <div class="font-serif text-3xl text-foreground">
            {{ user.stats.canceled }}
          </div>
        </div>
      </div>

      <!-- Main Layout: 2 Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-2 flex flex-col gap-8">
          <!-- Your Membership Section -->
          <div>
            <h3
              class="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#B59A6D] mb-6"
            >
              <UIcon name="i-lucide-award" class="w-4 h-4" />
              YOUR MEMBERSHIP
            </h3>

            <div class="bg-[#C9A55A1A] border border-border rounded-sm p-8">
              <div
                class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 border border-primary-700 bg-[#C9A55A26] dark:bg-[#2A2722] flex items-center justify-center rounded-xs text-[#B59A6D]"
                  >
                    <UIcon name="i-lucide-star" class="w-5 h-5" />
                  </div>
                  <div>
                    <h4 class="font-serif text-3xl text-foreground font-normal">
                      {{ user.membership.name }}
                    </h4>
                    <p
                      class="text-[10px] font-bold tracking-widest uppercase text-primary-700 mt-1"
                    >
                      {{ user.membership.subtitle }}
                    </p>
                  </div>
                </div>
                <div
                  class="border border-primary-700 text-primary-700 bg-[#C9A55A26] text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-xs"
                >
                  {{ user.membership.period }}
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div>
                  <div
                    class="text-[10px] font-bold tracking-widest uppercase text-secondary-400 mb-2"
                  >
                    MEMBER SINCE
                  </div>
                  <div class="text-sm text-foreground font-serif">
                    {{ user.membership.tier }}
                  </div>
                </div>
                <div>
                  <div
                    class="text-[10px] font-bold tracking-widest uppercase text-secondary-400 mb-2"
                  >
                    BILLING
                  </div>
                  <div class="text-sm text-foreground font-serif">
                    {{ user.membership.billing }}
                  </div>
                </div>
                <div>
                  <div
                    class="text-[10px] font-bold tracking-widest uppercase text-secondary-400 mb-2"
                  >
                    MEMBER BENEFIT
                  </div>
                  <div class="text-sm text-foreground font-serif">
                    {{ user.membership.benefit }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bookings Section -->
          <div>
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
            >
              <h3
                class="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#B59A6D]"
              >
                <UIcon name="i-lucide-calendar-days" class="w-4 h-4" />
                BOOKINGS
              </h3>

              <div>
                <ClassFilter v-model="activeTab" :filters="tabs" />
              </div>
            </div>

            <!-- Bookings List -->
            <div v-if="filteredBookings.length > 0" class="flex flex-col">
              <ProfileBookingItem
                v-for="booking in filteredBookings"
                :key="booking.id"
                :booking="booking"
              />
            </div>

            <!-- Empty State for Bookings -->
            <div
              v-else
              class="py-20 flex flex-col items-center justify-center text-center"
            >
              <div
                class="w-14 h-14 border border-border bg-card flex items-center justify-center text-[#B59A6D] rounded-sm mb-6"
              >
                <UIcon name="i-lucide-calendar" class="w-6 h-6" />
              </div>
              <h4 class="font-serif text-2xl text-foreground mb-3">
                No Bookings Found
              </h4>
              <p class="text-sm text-stone-400 font-light">
                Book sessions, spa or passes to begin your ritual
              </p>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div>
          <div class="bg-[#EDEAE7] dark:bg-card rounded-sm p-8">
            <h3
              class="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#B59A6D] mb-8"
            >
              <UIcon name="i-lucide-user" class="w-4 h-4" />
              USER DETAILS
            </h3>

            <div class="space-y-8 mb-12">
              <div>
                <div
                  class="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-secondary-400 mb-2"
                >
                  <UIcon name="i-lucide-user" class="w-3.5 h-3.5" />
                  NAME
                </div>
                <div class="text-sm text-secondary-700 dark:text-secondary-200">
                  {{ user.name }}
                </div>
              </div>

              <div>
                <div
                  class="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-secondary-400 mb-2"
                >
                  <UIcon name="i-lucide-mail" class="w-3.5 h-3.5" />
                  EMAIL
                </div>
                <div class="text-sm text-secondary-700 dark:text-secondary-200">
                  {{ user.email }}
                </div>
              </div>

              <div>
                <div
                  class="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-secondary-400 mb-2"
                >
                  <UIcon name="i-lucide-phone" class="w-3.5 h-3.5" />
                  PHONE
                </div>
                <div class="text-sm text-secondary-700 dark:text-secondary-200">
                  {{ user.phone }}
                </div>
              </div>

              <div>
                <div
                  class="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-stone-500 mb-2"
                >
                  <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
                  MEMBER SINCE
                </div>
                <div class="text-sm text-secondary-700 dark:text-secondary-200">
                  {{ user.memberSince }}
                </div>
              </div>
            </div>

            <!-- Sign Out Button -->
            <button
              class="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FB2C361A] hover:bg-[#FB2C361A]/80 transition-colors border border-[#FB2C3626] rounded-xs text-[#E5484D] text-[11px] font-bold tracking-[0.15em] uppercase hover:cursor-pointer"
              @click="isSignOutModalOpen = true"
            >
              SIGN OUT
              <UIcon name="i-lucide-log-out" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <profile-signout-modal
    :open="isSignOutModalOpen"
    :loading="loadingSignOut"
    @close="isSignOutModalOpen = false"
    @confirm="handleLogout"
  />
</template>

<style scoped></style>
