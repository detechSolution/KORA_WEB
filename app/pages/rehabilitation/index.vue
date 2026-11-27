<script setup lang="ts">
import { IMAGES } from "~/utils/images";

const physioWhatsApp
  = "https://wa.me/+9779818000015?text=Hi%20KORA%2C%20I%27d%20love%20to%20book%20an%20appointment%20for%20physiotherapy.";

const clinicalServices = [
  {
    tier: "Comprehensive Clinical Assessment",
    description:
      "60-minute deep-dive diagnostic incorporating dynamic movement screening and joint goniometry.",
    fee: "NPR 3,000",
  },
  {
    tier: "Targeted Sports Rehabilitation",
    description:
      "Precision interventions tailored to athletic recovery, acute injury triage, and post-operative restoration.",
    fee: "NPR 3,000",
  },
  {
    tier: "Manual & Myofascial Therapy",
    description:
      "Specialized soft-tissue manipulation, joint mobilization, and instrument-assisted myofascial release (IASTM).",
    fee: "NPR 3,000",
  },
  {
    tier: "Postural & Structural Realignment",
    description:
      "Ergonomic and movement pattern restructuring designed to eliminate chronic spinal stress and postural strain.",
    fee: "NPR 3,000",
  },
];

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Rehabilitation",
  description:
    "KORA Performance Rehabilitation dismantles the boundary between reactive treatment and proactive optimization with tailored movement protocols.",
});
</script>

<template>
  <div
    class="bg-background dark:bg-secondary-900 text-foreground font-sans min-h-screen"
  >
    <!-- Hero Section -->
    <div class="relative mb-16">
      <class-header label="Performance Rehabilitation" title="Rehabilitation">
        <div class="space-y-6">
          <h2
            class="font-serif text-2xl md:text-3xl text-foreground font-normal leading-tight tracking-wide"
          >
            Precision Movement. Uncompromised Recovery.
          </h2>
          <p
            class="text-muted-foreground font-light text-sm md:text-base leading-relaxed text-justify"
          >
            KORA Performance Rehabilitation dismantles the boundary between
            reactive treatment and proactive optimization. We engineer tailored
            movement protocols designed to restore structural integrity, erase
            pain, and unlock your physical ceiling.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 pt-2">
            <base-button :to="physioWhatsApp" target="_blank">
              BOOK YOUR PHYSIO APPOINTMENT
            </base-button>
            <base-button to="#continuum" variant="outline">
              EXPLORE THE CONTINUUM
            </base-button>
          </div>
        </div>
      </class-header>

      <div
        class="absolute top-0 right-0 w-64 h-64 md:w-76 md:h-76 xl:w-80 xl:h-80 aspect-square z-10 -translate-y-12"
      >
        <img
          :src="IMAGES.LEAF"
          alt="Kora foliage decoration"
          class="w-full h-full object-cover"
        >
      </div>
    </div>

    <!-- Philosophy & Continuum -->
    <section
      id="continuum"
      class="w-full lg:h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-background dark:bg-secondary-900 scroll-mt-24"
    >
      <div
        class="w-full h-[32vh] sm:h-[40vh] md:h-[46vh] lg:h-full relative overflow-hidden group order-1"
      >
        <img
          :src="IMAGES.REHAB_MOVEMENT"
          alt="KORA performance rehabilitation floor"
          class="w-full h-full object-cover transition-transform duration-6000 ease-out-quad group-hover:scale-105"
        >
        <div
          class="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none"
        />
      </div>

      <div
        class="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 lg:py-0 order-2"
      >
        <h3
          class="font-serif text-3xl md:text-4xl text-foreground font-normal leading-tight tracking-wide mb-6"
        >
          The Philosophy<br>& Continuum
        </h3>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-6"
        >
          We view human movement not as isolated joints or localized symptoms,
          but as an interconnected masterpiece of biomechanics. KORA operates at
          the intersection of medical science, athletic performance, and sensory
          refinement.
        </p>
        <p class="font-semibold text-foreground text-sm md:text-base mb-2">
          Total Functional Integration
        </p>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed"
        >
          Pain is rarely a localized failure; it is a systemic compensation. Our
          methodology traces dysfunction back to its biomechanical origin,
          reconstructing foundational patterns to build a body that is
          resilient, adaptable, and effortlessly strong.
        </p>
      </div>
    </section>

    <!-- Warm Handoff Protocol -->
    <section
      class="w-full lg:h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-background dark:bg-secondary-900"
    >
      <div
        class="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 lg:py-0 order-2 lg:order-1"
      >
        <h3
          class="font-serif text-3xl md:text-4xl text-foreground font-normal leading-tight tracking-wide mb-6"
        >
          The Warm<br>Handoff Protocol
        </h3>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-6"
        >
          Recovery does not end when acute pain subsides. KORA bridges the
          critical gap between clinical rehabilitation and high-level
          conditioning.
        </p>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-8"
        >
          Through structured communication between our clinical physical
          therapists, strength coaches, and movement specialists, your
          transition from injury to peak performance is seamless, safe, and
          deliberate.
        </p>
        <div class="w-fit">
          <base-button :to="physioWhatsApp" target="_blank">
            BOOK YOUR PHYSIO APPOINTMENT
          </base-button>
        </div>
      </div>

      <div
        class="w-full h-[32vh] sm:h-[40vh] md:h-[46vh] lg:h-full relative overflow-hidden group order-1 lg:order-2"
      >
        <img
          :src="IMAGES.REHAB_GYM"
          alt="Clinical physical therapy at KORA"
          class="w-full h-full object-cover transition-transform duration-[6000ms] ease-out-quad group-hover:scale-105"
        >
        <div
          class="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none"
        />
      </div>
    </section>

    <!-- Sanctuary Standards -->
    <section
      class="w-full lg:h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-background dark:bg-secondary-900"
    >
      <div
        class="w-full h-[32vh] sm:h-[40vh] md:h-[46vh] lg:h-full relative overflow-hidden group order-1"
      >
        <img
          :src="IMAGES.REHAB_MEDITATE"
          alt="The KORA sanctuary environment"
          class="w-full h-full object-cover object-top transition-transform duration-[6000ms] ease-out-quad group-hover:scale-105"
        >
        <div
          class="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none"
        />
      </div>

      <div
        class="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 lg:py-0 order-2"
      >
        <h3
          class="font-serif text-3xl md:text-4xl text-foreground font-normal leading-tight tracking-wide mb-6"
        >
          Sanctuary<br>Standards
        </h3>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-6"
        >
          Housed within the pristine environment of Budhanilkantha, KORA is
          designed as a sanctuary.
        </p>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed"
        >
          We reject the clinical coldness of traditional physical therapy
          centers, offering instead a serene, hyper-focused space where
          state-of-the-art diagnostic technology meets quiet luxury.
        </p>
      </div>
    </section>

    <!-- Clinical Services & Modalities -->
    <section
      class="py-20 px-8 md:px-16 lg:px-28 bg-background dark:bg-secondary-900"
    >
      <div class="max-w-6xl mx-auto text-center mb-12 relative z-10">
        <h2
          class="font-serif text-3xl md:text-4xl text-foreground font-normal leading-tight tracking-wide mb-4"
        >
          Clinical Services & Modalities
        </h2>
        <p class="text-muted-foreground font-light text-sm md:text-base">
          Our clinical offerings are structured to deliver rapid symptom
          resolution alongside long-term mechanical restructuring.
        </p>
      </div>

      <div class="overflow-x-auto border border-border">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b border-border">
              <th
                class="w-1/3 p-6 text-left font-serif text-lg font-normal text-foreground border-r border-border"
              >
                Service Tier
              </th>
              <th
                class="w-1/3 p-6 text-left font-serif text-lg font-normal text-foreground border-r border-border"
              >
                Focus Area & Description
              </th>
              <th
                class="w-1/3 p-6 text-left font-serif text-lg font-normal text-foreground"
              >
                Base Fee
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="service in clinicalServices"
              :key="service.tier"
              class="border-b border-border last:border-b-0"
            >
              <td
                class="p-6 align-top text-sm text-foreground border-r border-border"
              >
                {{ service.tier }}
              </td>

              <td
                class="p-6 align-top text-sm font-light text-secondary-700 dark:text-secondary-400 border-r border-border"
              >
                {{ service.description }}
              </td>

              <td
                class="p-6 align-top text-sm font-light text-secondary-700 dark:text-secondary-400 whitespace-nowrap"
              >
                {{ service.fee }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p
        class="max-w-6xl mx-auto mt-6 border-l-2 border-primary-700 pl-4 text-xs md:text-sm text-muted-foreground font-light leading-relaxed"
      >
        <strong class="text-foreground font-medium">Note on International Guest Services:</strong>
        Treatments billed through or submitted to international insurance
        providers carry a standard processing surcharge of +NPR 500 per session
        to cover administrative documentation and international coding
        alignment.
      </p>

      <div
        class="max-w-5xl mx-auto flex flex-col sm:flex-row justify-center gap-4 mt-12 relative z-10"
      >
        <base-button :to="physioWhatsApp" target="_blank">
          BOOK YOUR INITIAL ASSESSMENT
        </base-button>
        <base-button to="/membership" variant="outline">
          EXPLORE MEMBERSHIP
        </base-button>
      </div>
    </section>

    <!-- Member Privileges & Bundled Programs -->
    <section
      class="py-20 px-8 md:px-16 lg:px-28 bg-background dark:bg-secondary-900"
    >
      <div class="max-w-6xl mx-auto text-center mb-12">
        <h2
          class="font-serif text-3xl md:text-4xl text-foreground font-normal leading-tight tracking-wide mb-4"
        >
          Member Privileges & Bundled Programs
        </h2>
        <p class="text-muted-foreground font-light text-sm md:text-base">
          Structured pathways that reward commitment to long-term structural
          transformation.
        </p>
      </div>

      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Movement Screening -->
        <div
          class="flex flex-col border border-border p-8 md:p-10 bg-background dark:bg-secondary-900"
        >
          <h3
            class="font-serif text-2xl md:text-3xl text-foreground font-normal leading-tight tracking-wide mb-4"
          >
            Complimentary Member<br>Movement Screening
          </h3>
          <p
            class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-6"
          >
            KORA members receive access to complimentary initial movement
            screenings designed to detect subtle compensations before they
            manifest as performance bottlenecks or injuries.
          </p>
          <p
            class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-8"
          >
            <strong class="text-foreground font-medium">Access:</strong>
            Bookable via the KORA App or directly at the Front Desk.
          </p>
          <div class="mt-auto w-fit">
            <base-button to="/membership" variant="outline">
              BECOME A MEMBER
            </base-button>
          </div>
        </div>

        <!-- Bundles -->
        <div
          class="flex flex-col border border-border p-8 md:p-10 bg-background dark:bg-secondary-900"
        >
          <h3
            class="font-serif text-2xl md:text-3xl text-foreground font-normal leading-tight tracking-wide mb-4"
          >
            Performance &<br>Recovery Bundles
          </h3>
          <p
            class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-6"
          >
            Commitment to structural transformation yields the greatest returns
            over dedicated time horizons.
          </p>
          <p class="font-semibold text-foreground text-sm md:text-base mb-3">
            5-Session Performance Rehabilitation Package
          </p>
          <ul
            class="space-y-3 text-sm md:text-base text-muted-foreground font-light mb-8"
          >
            <li>
              &bull; Includes comprehensive baseline assessment and 4 follow-up
              targeted therapy sessions.
            </li>
            <li>
              &bull; Customized home-exercise programming and direct therapist
              messaging access.
            </li>
          </ul>
          <div class="flex items-end gap-3 mb-8">
            <span class="font-jakarta text-3xl text-foreground">NPR 11,000</span>
            <span class="text-xs md:text-sm text-muted-foreground font-light pb-1">
              Savings of NPR 1,500
            </span>
          </div>
          <div class="mt-auto w-fit">
            <base-button :to="physioWhatsApp" target="_blank">
              BOOK YOUR PHYSIO APPOINTMENT
            </base-button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer CTA Section -->
    <section
      class="relative py-28 md:py-36 px-6 overflow-hidden bg-background dark:bg-secondary-900 text-center flex flex-col items-center justify-center"
    >
      <div
        class="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 pointer-events-none select-none z-10 opacity-30 md:opacity-40"
      >
        <img
          :src="IMAGES.LEAF"
          alt="leaf"
          class="w-full h-full object-cover scale-x-[-1] scale-y-[-1]"
        >
      </div>
      <div
        class="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 pointer-events-none translate-x-12 -translate-y-12 select-none z-10 opacity-30 md:opacity-40"
      >
        <img
          :src="IMAGES.LEAF"
          alt="leaf decoration"
          class="w-full h-full object-cover"
        >
      </div>

      <div
        class="max-w-[1400px] flex flex-col items-center justify-center gap-12 relative z-20"
      >
        <div class="mx-auto flex flex-col items-center max-w-3xl">
          <h2
            class="font-serif text-3xl md:text-5xl text-foreground font-normal leading-tight tracking-wide mb-6"
          >
            Begin Your<br>
            <span class="text-primary italic">Transformation</span>
          </h2>

          <p
            class="max-w-2xl text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-10"
          >
            Experience the ultimate synthesis of clinical rigor and
            sanctuary-level care.
          </p>

          <div
            class="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center"
          >
            <base-button :to="physioWhatsApp" target="_blank">
              BOOK YOUR INITIAL ASSESSMENT
            </base-button>
            <base-button to="/membership" variant="outline">
              EXPLORE MEMBERSHIP
            </base-button>
            <base-button
              to="#mobile_app_store_link"
              target="_blank"
              variant="outline"
            >
              DOWNLOAD THE KORA APP
            </base-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ease-out-quad {
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
</style>
