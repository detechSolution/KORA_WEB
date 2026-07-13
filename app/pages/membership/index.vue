<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { useNotification } from "~/composables/use-notification";
import { useAuthStore } from "~/stores/auth";
import { useMembershipStore } from "~/stores/membership";
import { getApiErrorMessage } from "~/utils/error";
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Membership Rituals",
  description:
    "Choose your ritual and join Kora. Explore our membership tiers and specialized passes.",
});

const authStore = useAuthStore();
const router = useRouter();
const membershipStore = useMembershipStore();
const { error: showError } = useNotification();

const membershipPeriods = [
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
  "100 DAYS",
  "PASSES",
];
const loading = ref(true);
const isPassModalOpen = ref(false);
const selectedPass = ref<any>(null);
const activePeriod = ref("MONTHLY");
const isMembershipModalOpen = ref(false);
const selectedMembershipTier = ref<any>(null);
const selectedMembershipPrice = ref<string>("");
const userDetail = JSON.parse(localStorage.getItem("user_data") || "{}");

const hasMembership = computed(() => {
  return !!userDetail?.membership?.membershipPlanId;
});

const hasActivePass = computed(() => {
  return !!userDetail?.passes?.id;
});

const membershipPlans = computed(() => {
  const period = activePeriod.value.toLowerCase();

  const plans
    = period === "100 days"
      ? membershipStore.groupedMembershipPlans.custom
      : membershipStore.groupedMembershipPlans[
        period as "monthly" | "quarterly" | "yearly"
      ] || [];

  return plans.map((tier: any) => ({
    ...tier,
    selectedOption: tier.options?.find(
      (option: any) => option.frequency?.toUpperCase() === activePeriod.value,
    ),
  }));
});

function getIcon(index: number) {
  const icons = ["i-lucide-sparkles", "i-lucide-star", "i-lucide-crown"];

  return icons[index] || "i-lucide-check";
}

function getDescriptionItems(description: string) {
  if (!description)
    return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(description, "text/html");

  return Array.from(doc.querySelectorAll("li"))
    .map(item => item.textContent?.trim())
    .filter(Boolean);
}

function openPassModal(pass: any) {
  if (authStore.isAuthenticated) {
    selectedPass.value = pass;
    isPassModalOpen.value = true;
  }
  else {
    router.push("/login");
  }
}

function openMembershipModal(tier: any) {
  if (authStore.isAuthenticated) {
    selectedMembershipTier.value = tier;

    selectedMembershipPrice.value = `Rs. ${tier.selectedOption?.price?.toLocaleString()}`;

    isMembershipModalOpen.value = true;
  }
  else {
    router.push("/login");
  }
}

async function getMembershipPlans() {
  try {
    loading.value = true;

    await membershipStore.getMembership();
  }
  catch (error: unknown) {
    showError({
      message: getApiErrorMessage(error, "Failed to load membership plans"),
    });
  }
  finally {
    loading.value = false;
  }
}

async function getPassPlans() {
  try {
    loading.value = true;

    await membershipStore.getPass();
  }
  catch (error: unknown) {
    showError({
      message: getApiErrorMessage(error, "Failed to load pass plans"),
    });
  }
  finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await getMembershipPlans();
  await getPassPlans();
});
</script>

<template>
  <div
    class="relative bg-background dark:bg-secondary-900 text-foreground dark:text-white transition-colors duration-300 w-full min-h-screen overflow-hidden"
  >
    <div
      class="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 xl:w-[480px] xl:h-[480px] pointer-events-none select-none z-10 opacity-30 md:opacity-40"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage left"
        class="w-full h-full object-cover scale-x-[-1] -translate-x-12 -translate-y-12 rotate-12"
      >
    </div>

    <div
      class="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 xl:w-[480px] xl:h-[480px] pointer-events-none select-none z-10 opacity-30 md:opacity-40"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage right"
        class="w-full h-full object-cover translate-x-12 -translate-y-12 -rotate-12"
      >
    </div>

    <ClassHeader
      label="Kora Membership"
      title="Choose Your Ritual"
      class="pt-6"
    />

    <div class="relative z-20 max-w-400 mx-auto text-center px-4 md:px-8">
      <!-- <span
        class="font-sans font-bold text-xs uppercase tracking-[0.25em] text-primary mb-3 block"
      >
        Kora Membership
      </span>

      <h1
        class="font-serif text-6xl md:text-8xl lg:text-9xl text-foreground dark:text-white font-normal leading-[1.1] tracking-wide mb-6"
      >
        Choose Your <br>
        <span class="text-primary italic">Ritual</span>
      </h1>

      <p
        class="text-sm md:text-base leading-relaxed text-foreground/75 dark:text-secondary-400 font-light max-w-2xl mx-auto"
      >
        We do not sell memberships; we facilitate metamorphosis.
      </p> -->

      <!-- <base-section-label
        label="KORA MEMBERSHIPS"
        align="center"
        class="my-12"
      /> -->

      <div class="w-full overflow-x-auto sm:overflow-visible scrollbar-hide">
        <div
          class="inline-flex min-w-max border border-border/80 bg-card/60 backdrop-blur-md p-1 rounded-xs"
        >
          <button
            v-for="period in membershipPeriods"
            :key="period"
            class="shrink-0 px-4 sm:px-5 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-xs transition-all duration-200 cursor-pointer whitespace-nowrap"
            :class="[
              activePeriod === period
                ? 'bg-primary text-white shadow-sm'
                : 'bg-transparent text-foreground hover:bg-white/[0.02]',
            ]"
            @click="activePeriod = period"
          >
            {{ period }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="loading"
      class="relative z-20 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-400 mx-auto mt-16 px-4 md:px-8 pb-12"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="border border-border/40 bg-card dark:bg-[#212121] rounded-xs p-6 md:p-8 flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center gap-4">
            <USkeleton class="w-11 h-11 rounded-xs" />
            <div class="flex flex-col gap-1">
              <USkeleton class="h-6 w-32" />
              <USkeleton class="h-3 w-12" />
            </div>
          </div>

          <div class="mt-4 flex flex-col gap-2">
            <USkeleton class="h-10 w-48" />
            <USkeleton class="h-4 w-24" />
          </div>

          <div class="h-px bg-stone-300 dark:bg-stone-700 my-6 w-full" />

          <ul class="space-y-4 my-8">
            <li
              v-for="j in 4"
              :key="j"
              class="flex items-start"
            >
              <USkeleton class="w-4 h-4 rounded-full mr-3 shrink-0" />
              <USkeleton class="h-4 w-full" />
            </li>
          </ul>
        </div>

        <div class="mt-6 pt-4">
          <USkeleton class="h-10 w-full rounded-xs" />
        </div>
      </div>
    </div>
    <div
      v-else-if="membershipPlans.length > 0"
      class="relative z-20 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-400 mx-auto mt-16 px-4 md:px-8 pb-12"
    >
      <div
        v-for="(tier, index) in membershipPlans"
        :key="tier.id"
        class="relative backdrop-blur-md rounded-xs p-6 md:p-8 flex flex-col justify-between transition-all duration-500 group"
        :class="[
          index === 1
            ? 'border border-primary-700 bg-[#EFEAE2] dark:bg-[#2A2722] lg:scale-[1.03] z-25'
            : 'border border-border/40 bg-card dark:bg-[#212121]',
        ]"
      >
        <div
          v-if="index === 1"
          class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-bold tracking-[0.2em] uppercase px-4 py-1 rounded-full shadow-sm z-30"
        >
          Most Chosen
        </div>

        <div>
          <div class="flex items-center gap-4">
            <div
              class="w-11 h-11 border rounded-xs flex items-center justify-center shrink-0 border-primary/20 bg-primary/5"
            >
              <UIcon :name="getIcon(index)" class="w-5 h-5 text-primary" />
            </div>

            <div>
              <h3
                class="font-serif text-xl md:text-2xl text-foreground dark:text-white"
              >
                {{ tier.name }}
              </h3>

              <p
                class="font-sans text-[10px] font-bold text-primary uppercase mt-0.5"
              >
                {{ tier.currency }}
              </p>
            </div>
          </div>

          <div v-if="tier.selectedOption" class="mt-4">
            <p
              class="font-serif text-4xl md:text-5xl text-foreground dark:text-white tracking-wide"
            >
              Rs. {{ tier.selectedOption.price?.toLocaleString() }}
            </p>

            <p class="text-xs text-muted-foreground mt-2 capitalize">
              Per {{ tier.selectedOption.frequency }}
            </p>
          </div>

          <div class="h-px bg-stone-300 dark:bg-stone-700 my-6 w-full" />

          <ul class="space-y-4 my-8">
            <li
              v-for="(feature, idx) in getDescriptionItems(tier.description)"
              :key="idx"
              class="flex items-start text-sm text-foreground/80 dark:text-white/80"
            >
              <UIcon
                name="i-lucide-check"
                class="w-4 h-4 text-primary shrink-0 mr-3 mt-0.5"
              />

              <span>
                {{ feature }}
              </span>
            </li>
          </ul>
        </div>

        <div class="mt-6 pt-4">
          <base-button
            :variant="index === 1 ? 'solid' : 'outline'"
            class="w-full"
            :disabled="!tier.selectedOption || hasMembership"
            @click="openMembershipModal(tier)"
          >
            BEGIN NOW
          </base-button>
        </div>
      </div>
    </div>
    <div
      v-else-if="
        activePeriod === 'PASSES' && membershipStore.passPlans.length > 0
      "
      class="relative z-20 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-400 mx-auto mt-16 px-4 md:px-8"
    >
      <div
        v-for="pass in membershipStore.passPlans"
        :key="pass.id"
        class="border border-[#E9DEC8] dark:border-border bg-card rounded-xs p-6 md:p-8 flex flex-col justify-between transition-all duration-300 group"
      >
        <div>
          <div class="flex justify-between items-baseline gap-2 mb-3">
            <h4
              class="font-serif text-xl md:text-2xl text-foreground dark:text-white"
            >
              {{ pass.name }}
            </h4>

            <span class="font-serif text-2xl text-primary font-normal shrink-0">
              Rs. {{ pass.price?.toLocaleString() }}
            </span>
          </div>

          <span
            v-if="pass.discount"
            class="inline-flex px-2 py-0.5 border border-primary/30 text-primary text-[9px] font-bold tracking-wider uppercase rounded-xs bg-primary/5 mb-4"
          >
            {{ pass.discount }}% DISCOUNT
          </span>

          <p
            class="text-xs md:text-sm text-muted-foreground dark:text-white/60 leading-relaxed mb-8"
            v-html="pass.description"
          />
        </div>

        <base-button
          variant="outline"
          :disabled="hasMembership || hasActivePass"
          @click="openPassModal(pass)"
        >
          BEGIN NOW
        </base-button>
      </div>
    </div>
    <div v-else class="relative z-20 mt-16 text-center">
      <span class="text-lg text-primary-900 dark:text-primary-800">
        Space to breathe, but no plans here.
      </span>
      <p class="text-sm text-secondary-500 dark:text-secondary-400">
        This timeframe is currently an open canvas. To find the perfect
        supportive structure for your practice, please explore our other
        membership durations.
      </p>
    </div>

    <!-- Passes Section -->
    <!-- <div
      class="relative z-20 border-t border-border bg-[#F1EEEA] dark:bg-[#1D1D1E] py-28 mt-28"
    >
      <div class="relative z-20 text-center">
        <base-section-label label="OUR PASSES" align="center" />

        <p
          class="text-sm md:text-base leading-relaxed text-secondary-500 dark:text-stone-400 font-light max-w-2xl mx-auto py-12"
        >
          Specialized passes curated by the KORA team for unique rituals and
          focused pathways.
        </p>
      </div>

      <div
        class="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-400 mx-auto px-4 md:px-8"
      >
        <div
          v-for="pass in membershipStore.passPlans"
          :key="pass.id"
          class="border border-[#E9DEC8] dark:border-border bg-card rounded-xs p-6 md:p-8 flex flex-col justify-between transition-all duration-300 group"
        >
          <div>
            <div class="flex justify-between items-baseline gap-2 mb-3">
              <h4
                class="font-serif text-xl md:text-2xl text-foreground dark:text-white"
              >
                {{ pass.name }}
              </h4>

              <span
                class="font-serif text-2xl text-primary font-normal shrink-0"
              >
                Rs. {{ pass.price?.toLocaleString() }}
              </span>
            </div>

            <span
              v-if="pass.discount"
              class="inline-flex px-2 py-0.5 border border-primary/30 text-primary text-[9px] font-bold tracking-wider uppercase rounded-xs bg-primary/5 mb-4"
            >
              {{ pass.discount }}% DISCOUNT
            </span>

            <p
              class="text-xs md:text-sm text-muted-foreground dark:text-white/60 leading-relaxed mb-8"
              v-html="pass.description"
            />
          </div>

          <base-button variant="outline" @click="openPassModal(pass)">
            BEGIN NOW
          </base-button>
        </div>
      </div>
    </div> -->

    <!-- Modals -->

    <MembershipPassBookingModal
      v-if="selectedPass"
      :is-open="isPassModalOpen"
      :pass="selectedPass"
      @close="isPassModalOpen = false"
    />

    <MembershipBookingModal
      v-if="selectedMembershipTier"
      :is-open="isMembershipModalOpen"
      :membership="selectedMembershipTier"
      :period="activePeriod"
      :price="selectedMembershipPrice"
      @close="isMembershipModalOpen = false"
    />
  </div>
</template>

<style scoped>
.scale-102 {
  transform: scale(1.02);
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
