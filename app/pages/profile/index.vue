<script setup lang="ts">
import type { Booking } from "~/data/profile";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import z from "zod";
import { useNotification } from "~/composables/use-notification";
import { usePagination } from "~/composables/use-pagination";
import { useAuthStore } from "~/stores/auth";
import { useMemberStore } from "~/stores/member";
import { formatDate } from "~/utils/format";
import { IMAGES } from "~/utils/images";

definePageMeta({
  auth: true,
  layout: "default",
});

useSeoMeta({
  title: "Kora | Profile",
  description: "View and manage your Kora profile and bookings.",
});

const router = useRouter();
const authStore = useAuthStore();
const memberStore = useMemberStore();
const { pagination } = usePagination(10);

const loading = ref(true);
const formRef = ref<InstanceType<typeof UForm> | null>(null);
const activeTab = ref("TODAY");
const activeSidebarTab = ref<"info" | "bookings" | "pass" | "password">("info");
const activePassTab = ref("ACTIVE");

const { success, error: showError } = useNotification();
const loadingPassword = ref(false);

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

type Schema = z.output<typeof schema>;
const passwordForm = reactive<Partial<Schema>>({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

async function handleUpdatePassword() {
  try {
    await formRef.value?.validate();
  }
  catch {
    return;
  }

  try {
    loadingPassword.value = true;
    const payload = {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    };
    await authStore.updatePassword(
      payload as { currentPassword: string; newPassword: string },
    );
    success({ message: "Password updated successfully." });
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
  }
  catch (error: any) {
    showError({
      message: error?.data?.message || "Failed to update password.",
    });
  }
  finally {
    loadingPassword.value = false;
  }
}

const profileSchema = z.object({
  height: z.string().optional(),
  weight: z.string().optional(),
  injuryHistory: z.string().optional(),
  preferences: z.string().optional(),
});

type ProfileSchema = z.output<typeof profileSchema>;
const profileForm = reactive<Partial<ProfileSchema>>({
  height: "",
  weight: "",
  injuryHistory: "",
  preferences: "",
});

const profileFormRef = ref<InstanceType<typeof UForm> | null>(null);
const loadingProfile = ref(false);

async function handleUpdateProfile() {
  try {
    await profileFormRef.value?.validate();
  }
  catch {
    return;
  }

  try {
    loadingProfile.value = true;
    const payload = {
      height: profileForm.height,
      weight: profileForm.weight,
      injuryHistory: profileForm.injuryHistory,
      preferences: profileForm.preferences,
    };
    await authStore.updateProfile(payload);
    success({ message: "Profile updated successfully." });
  }
  catch (error: any) {
    showError({
      message: error?.data?.message || "Failed to update profile.",
    });
  }
  finally {
    loadingProfile.value = false;
  }
}

const dashboardData = computed(() => memberStore.dashboardData);
const profileData = computed(() => dashboardData.value?.profile);
const summaryData = computed(() => dashboardData.value?.summary);
const membershipData = computed(() => dashboardData.value?.membership);

async function fetchBookings() {
  try {
    loading.value = true;
    const statusMap: Record<string, string> = {
      TODAY: "today",
      UPCOMING: "upcoming",
      PAST: "past",
      CANCELED: "cancelled",
    };
    const params = {
      status: statusMap[activeTab.value],
      page: pagination.value.page,
      limit: pagination.value.pageSize,
    };
    await memberStore.getBookings(params);
  }
  catch (error) {
    console.error("Error fetching bookings:", error);
  }
  finally {
    loading.value = false;
  }
}

const user = computed(() => {
  return {
    name: profileData.value?.fullName || "",
    initials: profileData.value?.initials || "",
    email: profileData.value?.email || "",
    phone: profileData.value?.phoneNumber || "",
    memberSince: formatDate(profileData.value?.memberSince ?? ""),
    isMember: membershipData.value?.isActive || false,
    membership: {
      hasPlan:
        !!membershipData.value
        && (!!membershipData.value.planId
          || !!(membershipData.value as any).membershipPlanId),
      name: membershipData.value?.planName || "",
      subtitle: "",
      period: membershipData.value?.frequencyLabel || "",
      tier: membershipData.value?.planName || "",
      billing: membershipData.value
        ? `${membershipData.value.currency} ${membershipData.value.price}`
        : "",
      benefit: membershipData.value?.memberBenefitPercent
        ? `${membershipData.value.memberBenefitPercent}% off`
        : "",
    },
    stats: {
      todayBookings: summaryData.value?.todayBookings || 0,
      totalBookings: summaryData.value?.totalBookings || 0,
      upcoming: summaryData.value?.upcomingBookings || 0,
      canceled: summaryData.value?.cancelledBookings || 0,
    },
  };
});

const filteredBookings = computed<Booking[]>(() => {
  const data = memberStore.bookingsData?.data || [];
  return data.map((b) => {
    return {
      id: b.id.toString(),
      title: b.itemName,
      type: (b.itemType === "session"
        ? "Session"
        : b.itemType === "spa"
          ? "Spa"
          : b.itemType === "pass"
            ? "Pass"
            : "Session") as "Session" | "Spa" | "Pass",
      date: formatDate(b.bookedFor),
      time: b.bookedFor ? formatDate(new Date(b.bookedFor), "hh:mm a") : "",
      location: "",
      price: `${b.currency} ${b.amount}`,
      image: b.bannerUrl,
      status: activeTab.value as "UPCOMING" | "PAST" | "CANCELED",
      productId: b.productId,
      itemType: b.itemType,
      refundStatus: b.refundStatus,
      visitors: b.visitors || [],
    };
  });
});

// Update the tab counts dynamically based on bookings data
const tabs = computed(() => {
  const pastCount = summaryData.value?.pastBookings || 0;

  return [
    { value: "TODAY", label: `TODAY (${user.value.stats.todayBookings})` },
    { value: "UPCOMING", label: `UPCOMING (${user.value.stats.upcoming})` },
    { value: "PAST", label: `PAST (${pastCount})` },
    { value: "CANCELED", label: `CANCELED (${user.value.stats.canceled})` },
  ];
});

const filteredPasses = computed(() => {
  const passes = dashboardData.value?.passes || [];
  return passes.filter(p => p.status.toUpperCase() === activePassTab.value);
});

watch(activeTab, async () => {
  await fetchBookings();
});

onMounted(async () => {
  if (import.meta.client) {
    try {
      const storedUserData = localStorage.getItem("user_data");
      if (storedUserData) {
        const parsed = JSON.parse(storedUserData);
        if (parsed?.profile) {
          profileForm.height = parsed.profile.height || "";
          profileForm.weight = parsed.profile.weight || "";
          profileForm.injuryHistory = parsed.profile.injuryHistory || "";
          profileForm.preferences = parsed.profile.preferences || "";
        }
      }
    }
    catch (e) {
      console.error("Error parsing user_data from localStorage", e);
    }
  }

  await memberStore.getDashboard();
  await fetchBookings();
});
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
      >
    </div>

    <div class="relative z-10 max-w-400 mx-auto mb-20 px-4 md:px-8 lg:px-12">
      <!-- Top Header / User Info -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
      >
        <div class="flex items-center gap-6">
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
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                Member Since: {{ user.memberSince }}
              </div>
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
            <UIcon
              name="i-lucide-calendar"
              class="w-3.5 h-3.5 text-[#B59A6D]"
            />
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
            <UIcon name="i-lucide-clock" class="w-3.5 h-3.5 text-[#B59A6D]" />
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
            <UIcon
              name="i-lucide-x-square"
              class="w-3.5 h-3.5 text-[#B59A6D]"
            />
            CANCEL REQUESTED
          </div>
          <div class="font-serif text-3xl text-foreground">
            {{ user.stats.canceled }}
          </div>
        </div>
      </div>

      <!-- Main Layout: Sidebar + Content -->
      <div class="flex flex-col lg:flex-row gap-5 lg:gap-8">
        <!-- Sidebar -->
        <div class="w-full lg:w-[280px] shrink-0">
          <div class="bg-card border border-border rounded-sm p-4">
            <button
              class="w-full flex items-center justify-start px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors"
              :class="
                activeSidebarTab === 'info'
                  ? 'bg-[#B59A6D] text-white'
                  : 'text-secondary-900 dark:text-stone-300 hover:bg-[#C9A55A1A]'
              "
              @click="activeSidebarTab = 'info'"
            >
              MY INFO
            </button>
            <button
              class="w-full flex items-center justify-start px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors"
              :class="
                activeSidebarTab === 'bookings'
                  ? 'bg-[#B59A6D] text-white'
                  : 'text-secondary-900 dark:text-stone-300 hover:bg-[#C9A55A1A]'
              "
              @click="activeSidebarTab = 'bookings'"
            >
              MY BOOKINGS
            </button>
            <button
              class="w-full flex items-center justify-start px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors"
              :class="
                activeSidebarTab === 'pass'
                  ? 'bg-[#B59A6D] text-white'
                  : 'text-secondary-900 dark:text-stone-300 hover:bg-[#C9A55A1A]'
              "
              @click="activeSidebarTab = 'pass'"
            >
              MY PASS
            </button>
            <button
              class="w-full flex items-center justify-start px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors"
              :class="
                activeSidebarTab === 'password'
                  ? 'bg-[#B59A6D] text-white'
                  : 'text-secondary-900 dark:text-stone-300 hover:bg-[#C9A55A1A]'
              "
              @click="activeSidebarTab = 'password'"
            >
              UPDATE PASSWORD
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1">
          <!-- MY INFO CONTENT -->
          <div v-if="activeSidebarTab === 'info'" class="flex flex-col gap-10">
            <!-- Membership -->
            <div
              v-if="user.membership.hasPlan"
              class="bg-[#C9A55A1A] border border-border rounded-sm p-6"
            >
              <div
                class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-10 h-10 border border-[#B59A6D] flex items-center justify-center rounded-xs text-[#B59A6D]"
                  >
                    <UIcon name="i-lucide-star" class="w-5 h-5" />
                  </div>
                  <div>
                    <h4 class="font-serif text-2xl text-foreground font-normal">
                      {{ user.membership.name }}
                    </h4>
                    <p
                      class="text-[9px] font-bold tracking-widest uppercase text-stone-400 mt-1"
                    >
                      {{ user.membership.subtitle || "DEEPEN THE PRACTICE" }}
                    </p>
                  </div>
                </div>
                <div
                  class="border border-[#B59A6D] text-[#B59A6D] text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-xs"
                >
                  {{ user.membership.period }}
                </div>
              </div>
              <div class="flex justify-between items-end pt-2 mt-4">
                <div>
                  <div
                    class="text-[9px] font-bold tracking-widest uppercase text-stone-500 mb-1"
                  >
                    MEMBER SINCE
                  </div>
                  <div class="text-lg text-foreground font-serif">
                    {{ user.memberSince }}
                  </div>
                </div>
                <div class="text-right">
                  <div
                    class="text-[9px] font-bold tracking-widest uppercase text-stone-500 mb-1"
                  >
                    BILLING
                  </div>
                  <div class="text-xl text-foreground font-serif">
                    {{ user.membership.billing }}
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="bg-card border border-border rounded-sm p-8 flex flex-col items-center justify-center text-center"
            >
              <div
                class="w-14 h-14 border border-border bg-[#C9A55A1A] flex items-center justify-center text-[#B59A6D] rounded-full mb-4"
              >
                <UIcon name="i-lucide-award" class="w-6 h-6" />
              </div>
              <h4 class="font-serif text-2xl text-foreground mb-2">
                No Active Membership
              </h4>
              <p class="text-sm text-stone-400 font-light mb-6">
                Elevate your experience with an exclusive Kora membership and
                unlock premium benefits.
              </p>
              <base-button
                variant="outline"
                class="w-full sm:w-auto px-8"
                @click="router.push('/membership')"
              >
                Explore Memberships
              </base-button>
            </div>

            <!-- Personal Details Form -->
            <div>
              <h3
                class="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#B59A6D] mb-6"
              >
                <UIcon name="i-lucide-file-text" class="w-4 h-4" />
                PERSONAL DETAILS
              </h3>

              <UForm
                ref="profileFormRef"
                :schema="profileSchema"
                :state="profileForm"
                class="mb-8"
                @submit="handleUpdateProfile"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <base-input
                    v-model="profileForm.height"
                    name="height"
                    type="text"
                    label="HEIGHT"
                    placeholder="Enter height in feet"
                  />

                  <base-input
                    v-model="profileForm.weight"
                    name="weight"
                    type="text"
                    label="WEIGHT"
                    placeholder="Enter weight in kg"
                  />

                  <base-input
                    v-model="profileForm.injuryHistory"
                    name="injuryHistory"
                    type="text"
                    label="INJURY HISTORY"
                    placeholder="Enter your injury history"
                  />

                  <base-input
                    v-model="profileForm.preferences"
                    name="preferences"
                    type="text"
                    label="PREFERENCE"
                    placeholder="Enter your preferences"
                  />
                </div>
                <base-button type="submit" :loading="loadingProfile">
                  UPDATE INFO
                </base-button>
              </UForm>
            </div>
          </div>

          <!-- MY BOOKINGS CONTENT -->
          <div v-if="activeSidebarTab === 'bookings'">
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
                <ClassFilter
                  v-model="activeTab"
                  :filters="tabs"
                  button-class="text-[9px] xl:text-xs"
                />
              </div>
            </div>

            <!-- Bookings List -->
            <div v-if="loading">
              <ProfileBookingSkeleton />
            </div>
            <div v-else>
              <div v-if="filteredBookings.length > 0" class="flex flex-col">
                <ProfileBookingItem
                  v-for="booking in filteredBookings"
                  :key="booking.id"
                  :booking="booking"
                  :active-tab="activeTab"
                  @fetch-bookings="fetchBookings"
                />
              </div>
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
            <base-pagination
              :page="pagination.page"
              :total="memberStore.bookingsData?.meta?.total || 0"
              :items-per-page="pagination.pageSize"
              :disabled="memberStore.loading"
              @update:page="
                (v) => {
                  pagination.page = v;
                  fetchBookings();
                }
              "
            />
          </div>

          <!-- MY PASSES CONTENT -->
          <div v-if="activeSidebarTab === 'pass'">
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
            >
              <div>
                <h3
                  class="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#B59A6D] mb-2"
                >
                  <UIcon name="i-lucide-ticket" class="w-4 h-4" />
                  MY PASSES
                </h3>
                <p class="text-sm text-stone-400 font-light">
                  View and manage your active and past passes.
                </p>
              </div>
              <base-button :to="{ path: '/membership', query: { tab: 'passes' } }">
                PURCHASE NEW PASS
              </base-button>
            </div>

            <div
              v-if="filteredPasses.length > 0"
              class="flex flex-col gap-6 mb-8"
            >
              <div
                v-for="pass in filteredPasses"
                :key="pass.id"
                class="bg-card border border-border rounded-sm flex flex-col md:flex-row overflow-hidden"
              >
                <div
                  class="bg-[#F3EFE9] dark:bg-[#2A2621] w-full md:w-[280px] p-6 flex flex-col justify-between shrink-0 relative"
                >
                  <div
                    class="absolute top-0 right-0 w-full h-full pointer-events-none select-none opacity-20 dark:opacity-10"
                  >
                    <img
                      :src="IMAGES.LEAF"
                      class="w-full h-full object-cover"
                    >
                  </div>
                  <div class="relative z-10 flex justify-end mb-8">
                    <UIcon
                      name="i-lucide-star"
                      class="w-6 h-6 text-[#B59A6D]"
                    />
                  </div>
                  <div class="relative z-10">
                    <h3 class="font-serif text-3xl text-foreground mb-1">
                      KORA
                    </h3>
                    <p
                      class="text-sm font-light text-foreground mb-4 uppercase"
                    >
                      {{ pass.name }}
                    </p>
                  </div>
                  <div class="relative z-10 mt-12">
                    <p
                      class="text-[9px] font-bold tracking-widest uppercase text-[#B59A6D]"
                    >
                      DEEPEN THE PRACTICE
                    </p>
                  </div>
                </div>

                <div class="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div
                      class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 border-b border-border pb-8"
                    >
                      <div>
                        <div
                          class="text-[9px] font-bold tracking-widest uppercase text-stone-500 mb-1"
                        >
                          PASS TYPE
                        </div>
                        <div class="text-lg font-serif text-foreground">
                          {{ pass.name }}
                        </div>
                      </div>
                      <div>
                        <div
                          class="text-[9px] font-bold tracking-widest uppercase text-stone-500 mb-1"
                        >
                          PURCHASED ON
                        </div>
                        <div
                          class="flex items-center gap-2 text-sm text-foreground"
                        >
                          <UIcon
                            name="i-lucide-calendar"
                            class="w-4 h-4 text-stone-400"
                          />
                          {{ formatDate(pass.startsOn) }}
                        </div>
                      </div>
                    </div>

                    <div
                      class="text-[10px] font-bold tracking-widest uppercase text-stone-500 mb-4"
                    >
                      PASS DETAILS
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <div
                          class="text-[9px] font-bold tracking-widest uppercase text-stone-500 mb-1"
                        >
                          Valid From
                        </div>
                        <div class="text-sm text-foreground">
                          {{ formatDate(pass.startsOn) }}
                        </div>
                      </div>
                      <div>
                        <div
                          class="text-[9px] font-bold tracking-widest uppercase text-stone-500 mb-1"
                        >
                          Valid Until
                        </div>
                        <div class="text-sm text-foreground">
                          {{ formatDate(pass.endsOn) }}
                        </div>
                      </div>
                      <div>
                        <div
                          class="text-[9px] font-bold tracking-widest uppercase text-stone-500 mb-1"
                        >
                          Total Price
                        </div>
                        <div class="text-sm text-foreground">
                          {{ pass.currency }} {{ pass.price }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
              class="py-12 flex flex-col items-center justify-center text-center bg-card border border-border rounded-sm mb-8"
            >
              <div
                class="w-14 h-14 border border-border bg-[#C9A55A1A] flex items-center justify-center text-[#B59A6D] rounded-full mb-4"
              >
                <UIcon name="i-lucide-ticket" class="w-6 h-6" />
              </div>
              <h4 class="font-serif text-2xl text-foreground mb-2">
                No Passes Found
              </h4>
              <p class="text-sm text-stone-400 font-light mb-6">
                You do not have any {{ activePassTab.toLowerCase() }} passes.
              </p>
            </div>

            <!-- About Passes Alert -->
            <div
              class="bg-card border border-border rounded-sm p-6 flex items-start gap-4"
            >
              <UIcon
                name="i-lucide-alert-circle"
                class="w-5 h-5 text-stone-500 shrink-0 mt-0.5"
              />
              <div>
                <h4
                  class="text-[10px] font-bold tracking-widest uppercase text-stone-500 mb-1"
                >
                  ABOUT PASSES
                </h4>
                <p class="text-xs text-stone-400">
                  Passes allow you to book sessions based on the validity and
                  usage limit. Make sure to check the details before booking.
                </p>
              </div>
            </div>
          </div>

          <!-- UPDATE PASSWORD CONTENT -->
          <div v-if="activeSidebarTab === 'password'">
            <h3
              class="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#B59A6D] mb-6"
            >
              <UIcon name="i-lucide-lock" class="w-4 h-4" />
              CHANGE PASSWORD
            </h3>

            <div
              class="bg-[#C9A55A1A] border border-border rounded-sm p-6 mb-8"
            >
              <h4 class="text-sm font-bold text-foreground mb-3">
                Password Requirements
              </h4>
              <ul
                class="text-xs text-stone-400 space-y-1.5 list-disc list-inside"
              >
                <li>At least 8 characters long</li>
                <li>Use a combination of letters and numbers</li>
                <li>Avoid using easily guessable passwords</li>
              </ul>
            </div>

            <UForm
              ref="formRef"
              :schema="schema"
              :state="passwordForm"
              class="space-y-6 mb-8 max-w-xl"
              @submit="handleUpdatePassword"
            >
              <base-input
                v-model="passwordForm.currentPassword"
                name="currentPassword"
                type="password"
                label="CURRENT PASSWORD"
                placeholder="Enter your current password"
              />

              <base-input
                v-model="passwordForm.newPassword"
                name="newPassword"
                type="password"
                label="NEW PASSWORD"
                placeholder="Enter your new password"
              />

              <base-input
                v-model="passwordForm.confirmPassword"
                name="confirmPassword"
                type="password"
                label="CONFIRM NEW PASSWORD"
                placeholder="Confirm your new password"
              />

              <base-button
                type="submit"
                :loading="loadingPassword"
                class="mt-6"
              >
                UPDATE PASSWORD
              </base-button>
            </UForm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
