<script setup lang="ts">
import { ref } from "vue";
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "KORA for Organizations | Corporate Memberships & Retreats",
  description: "Corporate memberships, flexible day-pass bundles, and private sanctuary buyouts for teams in Kathmandu.",
});

const inquiryOpen = ref(false);
const inquiryInterest = ref("");

const executiveBenefits = [
  ["Exclusive Allocation", "Part of KORA’s strictly capped 50-member Corporate Charter"],
  ["Movement & Gym", "Unlimited access to all studio classes and training floors"],
  ["Recovery Axis", "Full daily access to cold plunges, saunas, and contrast therapy"],
  ["Nuad Thai Spa by KORA", "15% exclusive corporate discount + 13 complimentary annual massages"],
  ["Cafe NORI", "12% corporate discount + one-time NPR 3,500 dining credit per executive"],
  ["Salon", "10% Off privilege"],
  ["Clinical Performance & Physio", "7% discount on rehabilitation packages + one-time complimentary movement screening"],
  ["Hospitality & Access", "1 monthly guest pass, daily towel service, 5-day advance booking window, and 10% Off events & workshops"],
  ["Transferability Policy", "Transferable from one executive to another"],
];

const dayPassBundles = [
  {
    tier: "Tier 1: Starter",
    pack: "10-Pack",
    validity: "10 day passes · 30-day validity",
    interest: "Day-Pass Bundle (10-pack)",
  },
  {
    tier: "Tier 2: Executive",
    pack: "20-Pack",
    validity: "20 day passes · 60-day validity",
    interest: "Day-Pass Bundle (20-pack)",
  },
  {
    tier: "Tier 3: Enterprise",
    pack: "50-Pack",
    validity: "50 day passes · 90-day validity",
    interest: "Day-Pass Bundle (50-pack)",
  },
];

const buyoutFeatures = [
  { feature: "Complete Spatial Exclusivity", detail: "Full-day private sanctuary access", included: true, addOn: false },
  { feature: "Movement Studios & Training Floor", detail: "Private team access", included: true, addOn: false },
  { feature: "Recovery Axis", detail: "Cold plunges, saunas & contrast therapy", included: true, addOn: false },
  { feature: "Locker Suites", detail: "Private changing & locker access", included: true, addOn: false },
  { feature: "Dedicated Coaching & Programming", detail: "Curated strength, mobility, breathwork & contrast sessions", included: true, addOn: false },
  { feature: "Dedicated Concierge & Stewards", detail: "On-site event coordination from arrival to departure", included: true, addOn: false },
  { feature: "Valet Parking", detail: "Seamless arrival & departure", included: true, addOn: false },
  { feature: "Cafe NORI Culinary Curation", detail: "Sugar-free, whole-food spreads & recovery elixirs with local ingredients", included: false, addOn: true },
  { feature: "Nuad Thai Private Spa Blocks", detail: "Dedicated therapist rosters for synchronized team rituals", included: false, addOn: true },
];

function openInquiry(interest = "") {
  inquiryInterest.value = interest;
  inquiryOpen.value = true;
}
</script>

<template>
  <main class="bg-background text-foreground dark:bg-secondary-900">
    <!-- Hero -->
    <section class="relative isolate min-h-[540px] overflow-hidden bg-secondary-900 text-white md:min-h-[620px]">
      <img
        :src="IMAGES.OFFERINGS_SESSIONS"
        alt="KORA sanctuary spaces for movement and recovery"
        class="absolute inset-0 -z-20 h-full w-full object-cover object-[center_70%]"
      >
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
      <div class="mx-auto flex min-h-[540px] max-w-400 items-center px-5 py-20 sm:px-8 md:min-h-[620px] lg:px-16">
        <div class="max-w-3xl">
          <p class="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-primary-300">
            KORA FOR ORGANIZATIONS
          </p>
          <h1 class="mb-5 max-w-2xl font-serif text-5xl leading-[1.03] tracking-wide sm:text-6xl md:text-7xl">
            Where Leadership Recalibrates.
          </h1>
          <p class="mb-8 max-w-2xl text-base leading-7 text-white/80 md:text-lg md:leading-8">
            High-performing teams require intentional recovery. From annual executive memberships and flexible day-pass allocations to private full-sanctuary buyouts, KORA offers Kathmandu’s foremost setting for corporate vitality and leadership offsites.
          </p>
          <base-button class="w-full sm:w-auto" @click="openInquiry()">
            Inquire for corporate rates
          </base-button>
        </div>
      </div>
    </section>

    <!-- Executive Memberships -->
    <section class="mx-auto max-w-400 px-4 py-16 sm:px-8 md:py-24 lg:px-16">
      <div class="mb-10 grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end md:gap-12">
        <div>
          <p class="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            PILLAR I · EXECUTIVE ANNUAL MEMBERSHIPS
          </p>
          <h2 class="font-serif text-4xl leading-tight sm:text-5xl">
            Executive Memberships
          </h2>
          <p class="mt-3 text-sm font-medium text-muted-foreground">
            Two options: minimum 5 or minimum 10 executives
          </p>
        </div>
        <div>
          <p class="text-sm leading-7 text-muted-foreground md:text-base">
            Designed for founders, C-suite leaders, and diplomatic missions seeking sustained physical and cognitive resilience. Memberships are allocated within KORA’s strictly capped 50-seat Corporate Charter to preserve sanctuary calm and uncrowded access.
          </p>
          <div class="mt-5">
            <base-button
              variant="outline"
              class="w-full sm:w-auto"
              @click="openInquiry('Executive Membership (min 5)')"
            >
              Request executive membership rates
            </base-button>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto border border-border">
        <table class="w-full min-w-[600px] border-collapse text-left text-sm">
          <caption class="bg-card dark:bg-secondary-900 px-5 py-4 text-left font-serif text-2xl">
            KORA Corporate Charter <span class="mt-1 block font-sans text-xs">Minimum 5 or 10 executives</span>
          </caption>
          <thead class="bg-card/80 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th scope="col" class="px-5 py-3 sm:px-7">
                Feature / privilege
              </th>
              <th scope="col" class="px-5 py-3 sm:px-7">
                Corporate Charter for each executive
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border bg-background/80">
            <tr v-for="[feature, privilege] in executiveBenefits" :key="feature">
              <th scope="row" class="px-5 py-4 text-left font-semibold text-foreground sm:px-7">
                {{ feature }}
              </th>
              <td class="px-5 py-4 leading-6 text-muted-foreground sm:px-7">
                {{ privilege }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-xs text-muted-foreground">
        Swipe sideways to view the full membership comparison.
      </p>

      <div class="mt-8 flex flex-col gap-4 border border-border bg-card/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p class="font-serif text-2xl">
            Choose the membership size that fits your team.
          </p>
          <p class="mt-1 text-sm text-muted-foreground">
            Minimum 5 or minimum 10 executives.
          </p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row">
          <base-button variant="outline" @click="openInquiry('Executive Membership (min 5)')">
            Inquire min 5
          </base-button>
          <base-button @click="openInquiry('Executive Membership (min 10)')">
            Inquire min 10
          </base-button>
        </div>
      </div>
    </section>

    <!-- Day-Pass Bundles -->
    <section class="bg-card/60 dark:bg-[#202020]">
      <div class="mx-auto max-w-400 px-4 py-16 sm:px-8 md:py-24 lg:px-16">
        <div class="mb-8 max-w-3xl">
          <p class="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            PILLAR II · FLEXIBLE DAY-PASS BUNDLES
          </p>
          <h2 class="font-serif text-4xl leading-tight sm:text-5xl">
            Day-Pass Bundles
          </h2>
          <p class="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
            Ideal for visiting delegations, executive rewards, or distributed teams requiring flexible sanctuary access without annual lock-ins. Day passes are not redeemable for special events or workshops.
          </p>
        </div>

        <div class="overflow-x-auto border border-border">
          <table class="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead class="bg-card dark:bg-secondary-900">
              <tr>
                <th class="px-4 py-4 font-semibold">
                  Bundle tier
                </th>
                <th class="px-4 py-4 font-semibold">
                  Volume & validity
                </th>
                <th class="px-4 py-4 font-semibold">
                  Classes & gym
                </th>
                <th class="px-4 py-4 font-semibold">
                  Cafe NORI
                </th>
                <th class="px-4 py-4 font-semibold">
                  Nuad Thai Spa
                </th>
                <th class="px-4 py-4 font-semibold">
                  Salon
                </th>
                <th class="px-4 py-4 font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border bg-background/80">
              <tr v-for="bundle in dayPassBundles" :key="bundle.pack">
                <td class="px-4 py-5 font-semibold">
                  {{ bundle.tier }}<span class="mt-1 block font-normal text-muted-foreground">{{ bundle.pack }}</span>
                </td>
                <td class="px-4 py-5 text-muted-foreground">
                  {{ bundle.validity }}
                </td>
                <td class="px-4 py-5 text-muted-foreground">
                  Unlimited classes & recovery area
                </td>
                <td class="px-4 py-5">
                  10% Off
                </td>
                <td class="px-4 py-5">
                  10% Off
                </td>
                <td class="px-4 py-5">
                  10% Off
                </td>
                <td class="px-4 py-5">
                  <base-button size="sm" @click="openInquiry(bundle.interest)">
                    Inquire now
                  </base-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-3 text-xs text-muted-foreground">
          Swipe sideways to view all bundle details.
        </p>
      </div>
    </section>

    <!-- Full-Day Sanctuary Buyout -->
    <section class="mx-auto max-w-400 px-4 py-16 sm:px-8 md:py-24 lg:px-16">
      <div class="mb-10 grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end md:gap-12">
        <div>
          <p class="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            PILLAR III · PRIVATE EXCLUSIVITY
          </p>
          <h2 class="font-serif text-4xl leading-tight sm:text-5xl">
            Full-Day Sanctuary Buyouts
          </h2>
        </div>
        <div>
          <p class="text-sm leading-7 text-muted-foreground md:text-base">
            Reserve the entire 24,000 sq. ft. KORA Sanctuary exclusively for your organization. Host a board offsite, leadership summit, or private brand activation with uninterrupted access to every movement studio, thermal suite, and courtyard space, with zero outside guests on premises. Capacity: up to 250 guests.
          </p>
        </div>
      </div>

      <div class="overflow-x-auto border border-border">
        <table class="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead class="bg-card dark:bg-secondary-900 dark:text-white">
            <tr>
              <th class="w-[58%] px-4 py-4 font-semibold sm:px-6">
                Included feature / optional add-on
              </th>
              <th class="px-4 py-4 text-center font-semibold">
                Included in buyout
              </th>
              <th class="px-4 py-4 text-center font-semibold">
                Bespoke add-on
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border bg-background/80">
            <tr v-for="item in buyoutFeatures" :key="item.feature">
              <td class="px-4 py-4 sm:px-6">
                <span class="font-semibold">{{ item.feature }}</span>
                <span class="mt-1 block text-xs leading-5 text-muted-foreground">{{ item.detail }}</span>
              </td>
              <td class="px-4 py-4 text-center">
                <UIcon
                  :name="item.included ? 'i-lucide-check' : 'i-lucide-minus'"
                  :class="item.included ? 'text-primary' : 'text-muted-foreground/50'"
                  class="h-5 w-5"
                />
              </td>
              <td class="px-4 py-4 text-center">
                <UIcon
                  :name="item.addOn ? 'i-lucide-check' : 'i-lucide-minus'"
                  :class="item.addOn ? 'text-primary' : 'text-muted-foreground/50'"
                  class="h-5 w-5"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-xs text-muted-foreground">
        Swipe sideways to view the full buyout comparison.
      </p>
      <div class="mt-8">
        <base-button class="w-full sm:w-auto" @click="openInquiry('Full-Day Sanctuary Buyout')">
          Inquire for buyout availability & rates
        </base-button>
      </div>
    </section>

    <!-- Contact -->
    <section class="border-t border-border bg-card px-4 py-10 sm:px-8 lg:px-16">
      <div class="mx-auto flex max-w-400 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="font-serif text-2xl">
            Let’s plan something meaningful for your team.
          </p>
          <p class="mt-1 text-sm">
            For corporate memberships, day-pass bundles, and private retreats.
          </p>
        </div>
        <a class="text-sm font-medium text-primary-700 underline underline-offset-4" href="mailto:info@koranepal.com">info@koranepal.com</a>
      </div>
    </section>

    <corporate-inquiry-modal
      :open="inquiryOpen"
      :initial-interest="inquiryInterest"
      @close="inquiryOpen = false"
    />
  </main>
</template>
