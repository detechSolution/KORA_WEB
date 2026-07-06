<script setup lang="ts">
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Terms & Policy",
  description:
    "By accessing or using Kora's services, guests agree to our terms, which are designed to ensure a safe, respectful, and seamless experience for everyone.",
});
</script>

<template>
  <div
    class="relative bg-background dark:bg-secondary-900 text-foreground dark:text-white transition-colors duration-300 w-full min-h-screen py-12 overflow-hidden"
  >
    <!-- Premium absolute-positioned foliage watermark overlay (Left) -->
    <div
      class="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 xl:w-[480px] xl:h-[480px] pointer-events-none select-none z-10 opacity-30 md:opacity-40"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage left"
        class="w-full h-full object-cover scale-x-[-1] -translate-x-12 -translate-y-12 rotate-12"
      >
    </div>

    <!-- Premium absolute-positioned foliage watermark overlay (Right) -->
    <div
      class="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 xl:w-[480px] xl:h-[480px] pointer-events-none select-none z-100000 opacity-30 md:opacity-40"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage right"
        class="w-full h-full object-cover translate-x-12 -translate-y-12 -rotate-12"
      >
    </div>

    <div class="relative z-20 mx-auto px-4 md:px-8">
      <div class="border-b border-border text-center space-y-8 pb-16">
        <h1
          class="font-serif text-3xl md:text-5xl lg:text-6xl text-secondary dark:text-white font-normal tracking-wide"
        >
          KORA Wellness Sanctuary:<br>Terms and Conditions
        </h1>
        <p
          class="text-xs md:text-base leading-relaxed text-secondary-500 dark:text-secondary-400 font-light max-w-4xl mx-auto"
        >
          At KORA Kathmandu, we want to curate an environment that is welcoming, mindful, egoless,
          growth-oriented, and free from unnecessary outside disturbance. It is important to us that all
          members are able to progress in their health and wellness journey by behaving in a manner that
          is respectful of all individuals within the KORA premises. Be aware that KORA is not a place to
          conduct personal business that involves solicitation of any kind. Members should be free to
          enjoy the facility to train, eat, recover, and engage in mutually beneficial discussions. To provide
          a professional level of service, we kindly ask that you follow our code of conduct, available to
          you within our Terms and Conditions.
        </p>
      </div>

      <div class="max-w-400 md:px-6 mx-auto py-24">
        <div class="space-y-8">
          <!-- Memberships & Payments -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Memberships &amp; Payments
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              All KORA memberships, workshops, and curated event packages are fully payable in advance. Except where explicitly dictated by a flexible rebooking window within the KORA mobile application, all purchases are non-transferable.
            </p>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Class passes are strictly non-refundable.
            </p>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              For workshops and special events, cancellations made up to 7 days before the event start time are subject to a 20% administration charge, with the remaining 80% allocated as internal KORA store credit. Cancellations made within 7 days of the event are completely non-refundable, and no credit will be issued.
            </p>
          </div>

          <!-- Access & Security -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Access &amp; Security
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Digital access tokens, biometric profiles, and gate access privileges are uniquely tied to an individual profile and are strictly non-transferable. Corporate-tiered memberships are restricted to designated, pre-verified corporate tokens managed by authorized partner institutions. Any person who breaches, bypasses, shares credentials, or forces entry through an automated access point without proper validation will have their access permanently suspended and will face strict legal penalties in accordance with the prevailing laws of Nepal.
            </p>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Physical access via the member-only gates will be automatically restricted by the system database if a profile does not possess a digitally validated Liability and Health Waiver.
            </p>
          </div>

          <!-- Membership Freeze -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Membership Freeze
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Annual (52-week) KORA Plus memberships are entitled to a maximum of 4 weeks of freeze time per year. Members must process and manage their freeze requests directly on their own via the KORA mobile application.
            </p>
          </div>

          <!-- Session Bookings & No-Show Policy -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Session Bookings &amp; No-Show Policy
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              To prevent a "No-Show" status on your profile, session modifications must be executed via the KORA mobile application or directly with the concierge desk at least 5 hours prior to the class start time. Frequent unexcused absences or "No-Show" marks will result in an automatic penalty, including a temporary suspension of booking privileges on the app.
            </p>
          </div>

          <!-- Code of Conduct & Terminations -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Code of Conduct &amp; Terminations
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              We maintain a rigorous standard of mutual respect, tranquility, and peace. KORA reserves the right to permanently terminate a membership profile due to a code of conduct breach; in such instances, a pro-rata refund of unutilized time will be issued, subject to a 20% legal administration penalty.
            </p>
          </div>

          <!-- Facility, Equipment & Property -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Facility, Equipment &amp; Property
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Any physical items, equipment, or architectural structures damaged due to reckless operation, misuse, or willful disregard of staff instructions will be subject to a financial fine matching the full replacement or repair cost.
            </p>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              All storage lockers are for temporary, daily use only and must be cleared upon departure. KORA does not guarantee the safety of valuables and bears no responsibility for lost, stolen, or damaged personal property left inside lockers or common areas.
            </p>
          </div>

          <!-- Health, Safety & Age Restrictions -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Health, Safety &amp; Age Restrictions
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Our team members, instructors, and guides are highly trained wellness artisans, but do not operate as licensed medical professionals. Members assume full personal responsibility for monitoring their physical limits during high-intensity movement or contrast therapy cycles (sauna, Jacuzzi, and cold plunge immersion). Seeking a formal medical clearance prior to introducing contrast conditioning is strongly advised.
            </p>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              All facility users must be at least 16 years of age. Children under 16 are strictly prohibited from the fitness and recovery zones. Children under 16 are allowed only in the café area.
            </p>
          </div>

          <!-- Intellectual Property -->
          <div class="flex flex-col gap-6 border-b border-border pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Intellectual Property
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              The unique architectural design, branding, and imagery of KORA may not be used for commercial portfolios, brand sponsorships, or monetized media without written management approval.
            </p>
          </div>

          <!-- Assumption of Risk & Liability -->
          <div class="flex flex-col gap-6 pb-6">
            <h3 class="font-serif text-secondary dark:text-white text-xl md:text-3xl font-normal">
              Assumption of Risk &amp; Liability
            </h3>
            <p class="text-xs md:text-base leading-relaxed text-secondary-700 dark:text-secondary-200 font-light">
              Members and guests enter KORA and utilize its facilities under a voluntary assumption of risk. Except in proven instances of structural gross negligence or direct equipment failure caused by KORA, the sanctuary, its corporate entities, and its directors bear no liability for physical injuries, systemic health events, personal property loss, or physiological incidents sustained within the facility.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
