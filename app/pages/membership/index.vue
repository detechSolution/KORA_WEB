<script setup lang="ts">
import { ref } from "vue";
import { membershipTiers, passes, membershipPeriods } from "~/data/membership";
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Membership Rituals",
  description:
    "Choose your ritual and join Kora. Explore our membership tiers and specialized passes.",
});

const activePeriod = ref("MONTHLY");

const getPrice = (tierId: string) => {
  if (activePeriod.value === "MONTHLY") {
    if (tierId === "standard") return "Rs. 3,500";
    if (tierId === "premium") return "Rs. 5,000";
    if (tierId === "executive") return "Rs. 10,000";
  } else if (activePeriod.value === "QUARTERLY") {
    if (tierId === "standard") return "Rs. 9,450"; // 10% discount
    if (tierId === "premium") return "Rs. 13,500";
    if (tierId === "executive") return "Rs. 27,000";
  } else if (activePeriod.value === "YEARLY") {
    if (tierId === "standard") return "Rs. 33,600"; // 20% discount
    if (tierId === "premium") return "Rs. 48,000";
    if (tierId === "executive") return "Rs. 96,000";
  } else if (activePeriod.value === "100 DAYS") {
    if (tierId === "standard") return "Rs. 10,500";
    if (tierId === "premium") return "Rs. 15,000";
    if (tierId === "executive") return "Rs. 30,000";
  }
  return "Rs. 0";
};

const getPeriodLabel = () => {
  if (activePeriod.value === "MONTHLY") return "Per month";
  if (activePeriod.value === "QUARTERLY") return "Per quarter";
  if (activePeriod.value === "YEARLY") return "Per year";
  if (activePeriod.value === "100 DAYS") return "Per 100 days";
  return "";
};

const getIcon = (tierId: string) => {
  if (tierId === "standard") return "i-lucide-sparkles";
  if (tierId === "premium") return "i-lucide-star";
  if (tierId === "executive") return "i-lucide-crown";
  return "i-lucide-check";
};

const isPassModalOpen = ref(false);
const selectedPass = ref<any>(null);

const openPassModal = (pass: any) => {
  selectedPass.value = pass;
  isPassModalOpen.value = true;
};

const isMembershipModalOpen = ref(false);
const selectedMembershipTier = ref<any>(null);
const selectedMembershipPrice = ref<string>("");

const openMembershipModal = (tier: any) => {
  selectedMembershipTier.value = tier;
  selectedMembershipPrice.value = getPrice(tier.id);
  isMembershipModalOpen.value = true;
};
</script>

<template>
  <div
    class="relative bg-background dark:bg-secondary-900 text-foreground dark:text-white transition-colors duration-300 w-full min-h-screen py-16 md:py-24 overflow-hidden"
  >
    <!-- Premium absolute-positioned foliage watermark overlay (Left) -->
    <div
      class="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 xl:w-[480px] xl:h-[480px] pointer-events-none select-none z-10 opacity-30 md:opacity-40"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage left"
        class="w-full h-full object-cover scale-x-[-1] -translate-x-12 -translate-y-12 rotate-12"
      />
    </div>

    <!-- Premium absolute-positioned foliage watermark overlay (Right) -->
    <div
      class="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 xl:w-[480px] xl:h-[480px] pointer-events-none select-none z-100000 opacity-30 md:opacity-40"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage right"
        class="w-full h-full object-cover translate-x-12 -translate-y-12 -rotate-12"
      />
    </div>

    <!-- Hero Header / Title Block -->
    <div class="relative z-20 max-w-400 mx-auto text-center px-4 md:px-8">
      <span
        class="font-sans font-bold text-xs uppercase tracking-[0.25em] text-primary mb-3 block"
      >
        Kora Membership
      </span>
      <h1
        class="font-serif text-6xl md:text-8xl lg:text-9xl text-foreground dark:text-white font-normal leading-[1.1] tracking-wide mb-6"
      >
        Choose Your <br />
        <span class="text-primary italic">Ritual</span>
      </h1>
      <p
        class="text-sm md:text-base leading-relaxed text-foreground/75 dark:text-secondary-400 font-light max-w-2xl mx-auto"
      >
        We do not sell memberships; we facilitate metamorphosis. Each tier is a
        deepening of your commitment to the self-chosen at the frequency that
        honours your life.
      </p>

      <base-section-label
        label="KORA MEMBERSHIPS"
        align="center"
        class="my-12"
      />

      <!-- Period Tabs Selector -->
      <div
        class="inline-flex border border-border/80 bg-card/60 backdrop-blur-md p-1 rounded-xs"
      >
        <button
          v-for="period in membershipPeriods"
          :key="period"
          @click="activePeriod = period"
          :class="[
            'px-5 py-2.5 text-xs font-semibold tracking-wider transition-all duration-200 uppercase rounded-xs cursor-pointer',
            activePeriod === period
              ? 'bg-primary text-white dark:text-white shadow-sm'
              : 'bg-transparent text-foreground hover:text-foreground dark:hover:text-white hover:bg-white/[0.02]',
          ]"
        >
          {{ period }}
        </button>
      </div>
    </div>

    <!-- Membership Pricing Cards Grid -->
    <div
      class="relative z-20 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-400 mx-auto mt-16"
    >
      <div
        v-for="tier in membershipTiers"
        :key="tier.id"
        :class="[
          'relative backdrop-blur-md rounded-xs p-6 md:p-8 flex flex-col justify-between transition-all duration-500 group',
          tier.isPopular
            ? 'border border-primary-700 bg-[#EFEAE2] dark:bg-[#2A2722] lg:scale-[1.03] z-25'
            : 'border border-border/40 bg-card dark:bg-[#212121] hover:border-primary/40 hover:bg-card/60 dark:hover:bg-[#18181B]/60',
        ]"
      >
        <!-- Popular Tier (Premium) Highlight badge indicator (Optional, clean layout) -->
        <div
          v-if="tier.isPopular"
          class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white dark:text-secondary-900 text-[9px] font-bold tracking-[0.2em] uppercase px-4 py-1 rounded-full shadow-sm z-30"
        >
          Most Chosen
        </div>

        <div>
          <!-- Header: Icon & Tier Names -->
          <div class="flex items-center gap-4">
            <div
              :class="[
                'w-11 h-11 border rounded-xs flex items-center justify-center shrink-0 transition-colors duration-300',
                tier.isPopular
                  ? 'border-primary-700 bg-[#E9DEC8] dark:bg-[#342F24]'
                  : 'border-[#D1D1D1] bg-[#E8E8E8] dark:border-secondary-700 dark:bg-secondary-800 group-hover:border-primary/40 group-hover:bg-primary/5',
              ]"
            >
              <UIcon
                :name="getIcon(tier.id)"
                class="w-5 h-5 text-primary-700"
              />
            </div>
            <div>
              <h3
                class="font-serif text-xl md:text-2xl text-foreground dark:text-white font-normal"
              >
                {{ tier.name }}
              </h3>
              <p
                class="font-sans text-[10px] font-bold text-primary-700 uppercase mt-0.5"
              >
                {{ tier.subtitle }}
              </p>
            </div>
          </div>

          <!-- Pricing Block -->
          <div class="mt-4">
            <p
              class="font-serif text-4xl md:text-5xl text-foreground dark:text-white font-normal tracking-wide"
            >
              {{ getPrice(tier.id) }}
            </p>
            <p class="text-xs text-muted-foreground mt-2">
              {{ getPeriodLabel() }}
            </p>
          </div>

          <!-- Divider -->
          <div class="h-px bg-stone-300 dark:bg-stone-700 my-6 w-full"></div>

          <!-- Features List -->
          <ul class="space-y-4 my-8">
            <li
              v-for="(feature, idx) in tier.features"
              :key="idx"
              class="flex items-start text-sm text-foreground/80 dark:text-white/80"
            >
              <UIcon
                name="i-lucide-check"
                class="w-4 h-4 text-primary shrink-0 mr-3 mt-0.5"
              />
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>

        <!-- Action Button -->
        <div class="mt-6 pt-4">
          <base-button v-if="tier.isPopular" @click="openMembershipModal(tier)" class="w-full">
            {{ tier.buttonText }}
          </base-button>
          <base-button v-else @click="openMembershipModal(tier)" variant="outline" class="w-full">
            {{ tier.buttonText }}
          </base-button>
        </div>
      </div>
    </div>
  </div>
  <!-- Passes Section Divider -->
  <div
    class="relative z-20 border-t border-border bg-[#F1EEEA] dark:bg-[#1D1D1E] py-28"
  >
    <!-- Our Passes Title block -->
    <div class="relative z-20 text-center">
      <base-section-label label="OUR PASSES" align="center" />
      <p
        class="text-sm md:text-base leading-relaxed text-secondary-500 dark:text-stone-400 font-light max-w-2xl mx-auto py-12"
      >
        Specialized passes curated by the KORA team for unique rituals and
        focused pathways.
      </p>
    </div>

    <!-- Passes Cards Grid -->
    <div
      class="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-400 mx-auto"
    >
      <div
        v-for="pass in passes"
        :key="pass.id"
        class="border border-[#E9DEC8] dark:border-border bg-card hover:border-primary/40 hover:bg-card/60 dark:hover:bg-[#18181B]/60 rounded-xs p-6 md:p-8 flex flex-col justify-between transition-all duration-300 group"
      >
        <div>
          <!-- Pass Header: Title & Price -->
          <div class="flex justify-between items-baseline gap-2 mb-3">
            <h4
              class="font-serif text-xl md:text-2xl text-foreground dark:text-white font-normal"
            >
              {{ pass.name }}
            </h4>
            <span class="font-serif text-2xl text-primary font-normal shrink-0">
              {{ pass.price }}
            </span>
          </div>

          <!-- Discount Tag Badge -->
          <span
            v-if="pass.discountTag"
            class="inline-flex px-2 py-0.5 border border-primary/30 text-primary text-[9px] font-bold tracking-wider uppercase rounded-xs bg-primary/5 mb-4"
          >
            {{ pass.discountTag }}
          </span>

          <!-- Pass Description -->
          <p
            class="text-xs md:text-sm text-muted-foreground dark:text-white/60 leading-relaxed mb-8"
          >
            {{ pass.description }}
          </p>
        </div>

        <!-- Button -->
        <base-button @click="openPassModal(pass)" variant="outline">
          {{ pass.buttonText }}
        </base-button>
      </div>
    </div>
    
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
/* Scoped luxury transition adjustments */
.scale-102 {
  transform: scale(1.02);
}
</style>
