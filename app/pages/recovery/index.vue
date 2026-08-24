<script setup lang="ts">
import { IMAGES } from "~/utils/images";

const faqs = [
  {
    label: "What is the age policy for the Recovery Axis?",
    content:
      "To preserve an uncompromised atmosphere of sensory quiet, KORA operates under a strict <strong>16 years and above policy</strong>. The indoor shalas, treatment rooms, and recovery pools are reserved exclusively as an adult wellness sanctuary.",
  },
  {
    label: "How does the wave-cresting pool function?",
    content:
      "Engineered with an adjustable hydro-resistance mechanism, the heated pool generates a smooth, continuous current. This allows competitive swimmers and triathletes to train dynamically against a controlled flow, perfecting stroke mechanics and building endurance without interruption.",
  },
  {
    label: "What are the target temperatures of your thermal circuit?",
    content:
      "<ul class='list-disc pl-5 space-y-2 mt-2'><li><strong>Cold Plunge:</strong> Calibrated strictly to <strong>10°C</strong> to trigger rapid vasoconstriction, reduce muscular inflammation, and accelerate central nervous system recovery.</li><li><strong>Heated Pool & Jacuzzi:</strong> Maintained at a therapeutic <strong>28°C to 38°C</strong> respectively to decompress the spine and ease myofascial tension.</li><li><strong>The Sauna:</strong> Set to high-heat dry standards to promote deep detoxification and metabolic flushing.</li></ul>",
  },
  {
    label:
      "Are wellness events like Sound Healing and Cinema Nights included in standard entry?",
    content:
      "Our weekly Cinema Nights are entirely complimentary for all active members and valid day-pass holders. For specialized workshops like Floating Sound Healing, access may be complimentary or require a separate session fee depending on the scheduling cycle. Because all evening programming operates under strictly capped capacities to preserve our sanctuary environment, all guests must verify the session's specific status and secure their positions in advance via the KORA Sanctuary Calendar on our <strong>KORA mobile application</strong> or website.",
  },
  {
    label: "Can I order food and drinks directly to my lounge bed?",
    content:
      "Yes. The pooldeck and courtyard are fully integrated with <strong>Cafe NORI</strong>. Members and guests can order post-recovery protein blends, functional adaptogenic teas, and nutrient-dense plates to their lounge beds via QR codes or the KORA App.",
    button: {
      text: "VIEW MEMBERSHIP OPTIONS",
      to: "/membership",
    },
  },
];

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Recovery",
  description:
    "Kora's recovery spaces are thoughtfully designed environments that support rest, restoration, and mindful well-being.",
});
</script>

<template>
  <div
    class="bg-background dark:bg-secondary-900 text-foreground font-sans min-h-screen"
  >
    <!-- Hero Section -->
    <div class="relative mb-16">
      <class-header label="" title="Recovery">
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed text-justify"
        >
          Kora’s recovery spaces are thoughtfully designed environments that
          support rest, restoration, and overall well-being. Blending calming
          aesthetics with evidence-based wellness practices, these spaces offer
          services such as guided relaxation, therapeutic treatments, and
          mindful recovery techniques. Each area is crafted to help individuals
          disconnect from daily stress, recharge physically and mentally, and
          return to their routines with renewed balance and energy.
        </p>
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

    <section
      class="w-full lg:h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden mb-16 lg:mb-0 bg-background dark:bg-secondary-900"
    >
      <div
        class="w-full h-[32vh] sm:h-[40vh] md:h-[46vh] lg:h-full relative overflow-hidden group order-1"
      >
        <img
          :src="IMAGES.RECOVERY_SAUNA"
          alt="Sauna"
          class="w-full h-full object-cover transition-transform duration-[6000ms] ease-out-quad group-hover:scale-105"
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
          An Uncompromised Sanctuary<br>For Physical Restoration.
        </h3>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-8"
        >
          Engineered for athletic preservation. Curated for profound
          neurological rest. Experience Hattigauda's premier private environment
          for advanced contrast therapy, active hydro-resistance, and sensory
          recovery.
        </p>
        <div class="sm:w-fit">
          <base-button :to="{ path: '/membership', query: { tab: 'passes' } }">
            EXPLORE GUEST PASSES
          </base-button>
        </div>
      </div>
    </section>

    <section
      class="w-full lg:h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-background dark:bg-secondary-900"
    >
      <div
        class="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 lg:py-0 order-2 lg:order-1"
      >
        <h3
          class="font-serif text-3xl md:text-4xl text-foreground font-normal leading-tight tracking-wide mb-6"
        >
          The Restorative Pathways
        </h3>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-6"
        >
          True physical optimization is not found in leisure. It is built
          through deliberate, physiological contrast. At KORA, our recovery
          space bridges the gap between active sports science and deep nervous
          system quiet.
        </p>
        <p class="font-semibold text-foreground text-sm md:text-base mb-2">
          The Active Element: Hydro-Resistance Prep Pool
        </p>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-8"
        >
          Designed for the uncompromising athlete. Our temperature-controlled
          pool utilizes an adjustable wave-cresting mechanism to simulate
          open-water currents. Fine-tune your stroke mechanics, build lactic
          resistance, and execute competition-level conditioning in a
          continuous, active stream.
        </p>
        <div class="w-fit">
          <base-button
            to="https://wa.me/+9779818000015?text=Hi%20KORA%2C%20I%E2%80%99m%20an%20athlete%20preparing%20for%20an%20upcoming%20competition.%20I%E2%80%99d%20love%20to%20learn%20more%20about%20your%20wave-cresting%20pool%20and%20athletic%20coaching%2Fphysiotherapy%20programs."
            target="_blank"
          >
            INQUIRE ABOUT ATHLETE COACHING & PREP
          </base-button>
        </div>
      </div>

      <div
        class="w-full h-[32vh] sm:h-[40vh] md:h-[46vh] lg:h-full relative overflow-hidden group order-1 lg:order-2"
      >
        <img
          :src="IMAGES.RECOVERY_COLD_PLUNGE"
          alt="Hydro-Resistance Prep Pool"
          class="w-full h-full object-cover transition-transform duration-[6000ms] ease-out-quad group-hover:scale-105"
        >
        <div
          class="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none"
        />
      </div>
    </section>

    <section
      class="w-full lg:h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-background dark:bg-secondary-900"
    >
      <div
        class="w-full h-[32vh] sm:h-[40vh] md:h-[46vh] lg:h-full relative overflow-hidden group order-1"
      >
        <img
          :src="IMAGES.RECOVERY_JACUZZI"
          alt="Contrast Communal Chambers"
          class="w-full h-full object-cover transition-transform duration-[6000ms] ease-out-quad group-hover:scale-105"
        >
        <div
          class="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none"
        />
      </div>

      <div
        class="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 lg:py-0 order-2"
      >
        <h3
          class="font-serif text-3xl md:text-4xl text-foreground font-normal leading-tight tracking-wide mb-8"
        >
          The Contrast Communal<br>Chambers
        </h3>
        <ul
          class="space-y-6 text-sm md:text-base text-muted-foreground font-light"
        >
          <li>
            <strong class="text-foreground font-medium block mb-1">&bull; The Jet Jacuzzi</strong>
            Target-point hydrotherapy engineered to relieve myofascial
            restriction, decompress the skeletal frame, and stimulate deep
            circulation.
          </li>
          <li>
            <strong class="text-foreground font-medium block mb-1">&bull; The 10°C Cold Plunge</strong>
            A calibrated, sub-thermal immersion designed to trigger instant
            vasoconstriction, quiet systemic inflammation, and reset the central
            nervous system post-exertion.
          </li>
          <li>
            <strong class="text-foreground font-medium block mb-1">&bull; The Sauna</strong>
            Deep-penetrating dry heat to stimulate cardiovascular efficiency,
            accelerate metabolic flushing, and encourage absolute muscle
            relaxation.
          </li>
        </ul>
      </div>
    </section>

    <section
      class="w-full lg:h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-background dark:bg-secondary-900"
    >
      <div
        class="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 lg:py-0 order-2 lg:order-1"
      >
        <h3
          class="font-serif text-3xl md:text-4xl text-foreground font-normal leading-tight tracking-wide mb-6"
        >
          The Social Sanctuary
        </h3>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-8"
        >
          Beyond physical repair lies the art of conscious rest. The open-air
          spaces of the KORA courtyard transition seamlessly from athletic
          recovery to quiet, high-vibrational social living.
        </p>
        <ul
          class="space-y-6 text-sm md:text-base text-muted-foreground font-light mb-8"
        >
          <li>
            <strong class="text-foreground font-medium block mb-1">&bull; The Courtyard & Pooldeck</strong>
            Lined with low-profile, oversized lounge beds and private tables
            serviced directly by Cafe NORI. This is an intentional, slow-paced
            zone designed for post-session nourishment, quiet work, or
            decompression.
          </li>
          <li>
            <strong class="text-foreground font-medium block mb-1">&bull; Liquid Resonance (Floating Sound Healing)</strong>
            An immersive hydro-acoustic therapy. While suspended on custom
            floating beds in our heated pool, sound frequencies from singing
            bowls and gongs travel directly through the water matrix, delivering
            a profound cellular-level energetic reset.
          </li>
          <li>
            <strong class="text-foreground font-medium block mb-1">&bull; Hydro-Cinema Nights</strong>
            Weekly evening screenings where the pool deck transforms. Float in
            the warm currents or lounge poolside under the stars with curated
            independent cinema, documentaries, and an aligned community.
          </li>
        </ul>
        <div class="flex flex-col sm:flex-row gap-4">
          <base-button to="/session">
            BOOK A SESSION
          </base-button>
          <base-button to="/schedules" variant="outline">
            VIEW WEEKLY CALENDAR
          </base-button>
        </div>
      </div>

      <div
        class="w-full h-[32vh] sm:h-[40vh] md:h-[46vh] lg:h-full relative overflow-hidden group order-1 lg:order-2"
      >
        <img
          :src="IMAGES.RECOVERY_SWIMMING_POOL"
          alt="The Social Sanctuary"
          class="w-full h-full object-cover transition-transform duration-[6000ms] ease-out-quad group-hover:scale-105"
        >
        <div
          class="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none"
        />
      </div>
    </section>

    <section
      class="py-20 px-8 md:px-16 lg:px-28 bg-background dark:bg-secondary-900"
    >
      <div class="max-w-6xl mx-auto text-center mb-12 relative z-10">
        <h2
          class="font-serif text-3xl md:text-4xl text-foreground font-normal leading-tight tracking-wide mb-4"
        >
          The Frameworks Of Entry
        </h2>
        <p class="text-muted-foreground font-light text-sm md:text-base">
          Access to the KORA Recovery Axis is carefully structured to preserve
          the low-capacity, high end environment of our space.
        </p>
      </div>

      <div class="overflow-x-auto border border-border">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b border-border">
              <th
                class="w-1/3 p-6 text-left font-serif text-lg font-normal text-foreground border-r border-border"
              >
                Access Type
              </th>
              <th
                class="w-1/3 p-6 text-left font-serif text-lg font-normal text-foreground border-r border-border"
              >
                What Is Included
              </th>
              <th
                class="w-1/3 p-6 text-left font-serif text-lg font-normal text-foreground"
              >
                Ideal For
              </th>
            </tr>
          </thead>

          <tbody>
            <tr class="border-b border-border">
              <td
                class="p-6 align-top text-sm text-foreground border-r border-border"
              >
                The Day Pass Asset
              </td>

              <td
                class="p-6 align-top text-sm font-light text-secondary-700 dark:text-secondary-400 border-r border-border"
              >
                Single-day access to the 10°C Plunge, Sauna, Jacuzzi, and
                Lounge.
              </td>

              <td
                class="p-6 align-top text-sm font-light text-secondary-700 dark:text-secondary-400"
              >
                Short-stay visitors and high performance event competitors.
              </td>
            </tr>
            <tr class="border-b border-border">
              <td
                class="p-6 align-top text-sm text-foreground border-r border-border"
              >
                The Sanctuary Membership
              </td>

              <td
                class="p-6 align-top text-sm font-light text-secondary-700 dark:text-secondary-400 border-r border-border"
              >
                Unlimited access to all thermal circuits, prep pool lanes, and
                member-exclusive events.
              </td>

              <td
                class="p-6 align-top text-sm font-light text-secondary-700 dark:text-secondary-400"
              >
                Elite athletes and corporate leaders prioritizing daily
                longevity.
              </td>
            </tr>
            <tr>
              <td
                class="p-6 align-top text-sm text-foreground border-r border-border"
              >
                Signature Experiential Passes
              </td>

              <td
                class="p-6 align-top text-sm font-light text-secondary-700 dark:text-secondary-400 border-r border-border"
              >
                All-inclusive luxury access featuring a custom KORA massage,
                private consultations with our on-site Physiotherapy and
                Nutrition teams, Cafe NORI F&B perks, and full thermal circuit
                access.
              </td>

              <td
                class="p-6 align-top text-sm font-light text-secondary-700 dark:text-secondary-400"
              >
                Those seeking deep mental restoration and community connection.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="max-w-5xl mx-auto flex flex-col sm:flex-row justify-center gap-4 mt-12 relative z-10"
      >
        <base-button :to="{ path: '/membership', query: { tab: 'passes' } }">
          GET A DAY PASS
        </base-button>
        <base-button to="/membership" variant="outline">
          VIEW MEMBERSHIP
        </base-button>
      </div>
    </section>

    <section class="p-8 sm:py-20 sm:px-28">
      <h2
        class="text-center font-serif text-3xl md:text-4xl text-foreground font-normal leading-tight tracking-wide mb-12"
      >
        Frequently Asked Questions
      </h2>
      <UAccordion
        :items="faqs"
        :ui="{
          item: 'px-6',
        }"
      >
        <template #content="{ item }">
          <div
            class="text-sm text-foreground/80 dark:text-secondary-500 font-light font-sans pb-4"
          >
            <div class="leading-relaxed" v-html="item.content" />
            <div v-if="item.button" class="mt-6 w-fit">
              <base-button :to="item.button.to" variant="outline">
                {{ item.button.text }}
              </base-button>
            </div>
          </div>
        </template>
      </UAccordion>
    </section>

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
            Commit to a Practice That Moves<br>
            With You,
            <span class="text-primary italic">Every Step of the Way</span>
          </h2>

          <p
            class="max-w-2xl text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-10"
          >
            Move beyond advanced therapies and into a deep sense of inner
            alignment. Memberships create a structured space for practice,
            designed for clarity, presence, and lasting transformation.
          </p>

          <div
            class="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <base-button to="/membership">
              BECOME A MEMBER
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
