<script setup lang="ts">
import { IMAGES } from "~/utils/images";

const faqs = [
  {
    label: "Is the ice bath suitable for beginners?",
    content:
      "Yes, our ice bath is suitable for beginners. We provide guidance on how to safely start and gradually increase your exposure.",
  },
  {
    label: "How much does recovery access cost at Kora Life ?",
    content:
      "Recovery access costs vary depending on the package. Please inquire with our team for detailed pricing options.",
  },
  {
    label: "What is contrast therapy and how does Kora run it?",
    content:
      "Contrast therapy involves alternating between hot and cold treatments to improve circulation and reduce inflammation. Kora provides guided sessions to maximize the benefits.",
  },
  {
    label: "Do I need a membership to access the recovery suite?",
    content:
      "While memberships offer the best value and ongoing access, we also offer casual drop-in sessions for non-members to experience our recovery suite.",
  },
  {
    label: "What specialist recovery services are available?",
    content:
      "Our specialist recovery services include ice baths, traditional saunas, infrared saunas, and targeted contrast therapy protocols.",
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
    class="bg-background dark:bg-secondary-900 text-foreground font-sans select-none min-h-screen"
  >
    <section
      class="w-full lg:h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden mb-16 lg:mb-0 bg-background dark:bg-secondary-900"
    >
      <div
        class="w-full h-[50vh] lg:h-full relative overflow-hidden group order-1"
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
        <div class="w-fit">
          <base-button :to="{ path: '/membership', query: { tab: 'passes' } }">
            EXPLORE GUEST PASSES
          </base-button>
        </div>
      </div>
    </section>

    <section
      class="w-full lg:h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-background dark:bg-secondary-900"
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
        class="w-full h-[50vh] lg:h-full relative overflow-hidden group order-1 lg:order-2"
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
      class="w-full lg:h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-background dark:bg-secondary-900"
    >
      <div
        class="w-full h-[50vh] lg:h-full relative overflow-hidden group order-1"
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
      class="w-full lg:h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-background dark:bg-secondary-900"
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
            BOOK AN SESSION
          </base-button>
          <base-button to="/schedules" variant="outline">
            VIEW WEEKLY CALENDAR
          </base-button>
        </div>
      </div>

      <div
        class="w-full h-[50vh] lg:h-full relative overflow-hidden group order-1 lg:order-2"
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
        <base-button
          to="/membership"
          variant="outline"
        >
          VIEW MEMBERSHIP
        </base-button>
      </div>
    </section>

    <section class="py-20 px-28">
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
      />
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
