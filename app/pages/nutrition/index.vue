<script setup lang="ts">
import { IMAGES } from "~/utils/images";

// const faqs = [
//   {
//     label: "Is the ice bath suitable for beginners?",
//     content:
//       "Yes, our ice bath is suitable for beginners. We provide guidance on how to safely start and gradually increase your exposure.",
//   },
//   {
//     label: "How much does recovery access cost at Kora Life ?",
//     content:
//       "Recovery access costs vary depending on the package. Please inquire with our team for detailed pricing options.",
//   },
//   {
//     label: "What is contrast therapy and how does Kora run it?",
//     content:
//       "Contrast therapy involves alternating between hot and cold treatments to improve circulation and reduce inflammation. Kora provides guided sessions to maximize the benefits.",
//   },
//   {
//     label: "Do I need a membership to access the recovery suite?",
//     content:
//       "While memberships offer the best value and ongoing access, we also offer casual drop-in sessions for non-members to experience our recovery suite.",
//   },
//   {
//     label: "What specialist recovery services are available?",
//     content:
//       "Our specialist recovery services include ice baths, traditional saunas, infrared saunas, and targeted contrast therapy protocols.",
//   },
// ];

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Nutrition",
  description:
    "Kora's nutrition philosophy centers on nourishing the body with wholesome, balanced meals that support overall health and well-being.",
});
</script>

<template>
  <div
    class="bg-background dark:bg-secondary-900 text-foreground font-sans min-h-screen"
  >
    <!-- Hero Section -->
    <div class="relative mb-16">
      <class-header label="" title="Nutrition">
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed text-justify"
        >
          Welcome to the culinary axis of the KORA Sanctuary. Cafe NORI is an
          intentional dining space engineered for high-performance athletes,
          creative minds, and global practitioners. We bridge the strict
          discipline of sports nutrition with the raw, vibrant flavors of the
          Kathmandu Valley. No refined sugars. No industrial seed oils. Just
          honest, macro-precise fuel to complement your practice on the floor
          and your focus at the desk.
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

    <!-- Nutrition Sections -->
    <section
      class="w-full lg:h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-background dark:bg-secondary-900"
    >
      <div
        class="w-full h-[32vh] sm:h-[40vh] md:h-[46vh] lg:h-full relative overflow-hidden group order-1"
      >
        <img
          :src="IMAGES.NUTRITION_FOOD"
          alt="A Sanctuary Of Flow"
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
          A Sanctuary Of Flow: The<br>Spatial Matrix
        </h3>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-8"
        >
          Cafe NORI is a multi-tiered environment designed to adapt to your
          daily rhythm, operating under a strict, uncompromised
          <strong>zero-tobacco and fully non-smoking</strong> mandate.
        </p>
        <ul
          class="space-y-6 text-sm md:text-base text-muted-foreground font-light mb-8"
        >
          <li>
            <strong class="text-foreground font-medium block mb-1">&bull; The Ground Floor & Courtyard | Open to All:</strong>
            A vibrant social canvas connecting local residents, remote creators,
            and global travelers over clean espresso and organic nourishment.
          </li>
          <li>
            <strong class="text-foreground font-medium block mb-1">&bull; The First-Floor Co-Working Suite | Open to All:</strong>
            A sunlit, distraction-free environment engineered for deep work.
            Features high-speed connectivity and an insulated
            <strong>6-person Private Meeting Room</strong> for seamless
            corporate strategy or collaborative pitches.
          </li>
          <li>
            <strong class="text-foreground font-medium block mb-1">&bull; The Poolside Deck | Exclusive Member Axis:</strong>
            A tranquil outdoor lounge reserved strictly for KORA Members and
            authorized sanctuary guests, offering absolute privacy by the water.
          </li>
        </ul>
        <div class="flex flex-col sm:flex-row gap-4">
          <base-button to="/membership">
            VIEW MEMBERSHIP
          </base-button>
          <base-button to="tel:+9779818000015" variant="outline">
            RESERVE MEETING ROOM
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
          The Performance Manifesto
        </h3>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-6"
        >
          We believe what you put into your body is an extension of your
          training. Our kitchen operates under four uncompromising global
          standards:
        </p>
        <ul
          class="space-y-6 text-sm md:text-base text-muted-foreground font-light mb-8"
        >
          <li>
            <strong class="text-foreground font-medium block mb-1">&bull; Mathematical Precision:</strong>
            Every signature plate, macro bowl, and recovery shake is audited for
            exact protein, clean carbohydrate, and healthy fat metrics—tracked
            seamlessly via the KORA mobile application.
          </li>
          <li>
            <strong class="text-foreground font-medium block mb-1">&bull; Terrane-Sourced Integrity:</strong>
            We partner directly with sustainable, independent farms across the
            valley. From crisp Himalayan greens to organic local grains, our
            ingredients arrive fresh and real.
          </li>
          <li>
            <strong class="text-foreground font-medium block mb-1">&bull; Active Gut Kinetics:</strong>
            We combine modern recovery science with ancestral wellness. Our menu
            weaves functional, living probiotics—fermented house tempeh, raw
            misos, and organic kombuchas—with targeted vitamin C enzymes to
            maximize iron bioavailability and cellular repair.
          </li>
        </ul>
        <div class="sm:w-fit">
          <base-button to="#mobile_app_store_link" target="_blank">
            PRE-ORDER RECOVERY FUEL
          </base-button>
        </div>
      </div>
      <div
        class="w-full h-[32vh] sm:h-[40vh] md:h-[46vh] lg:h-full relative overflow-hidden group order-1 lg:order-2"
      >
        <img
          :src="IMAGES.NUTRITION_PHILOSOPHY"
          alt="The Performance Manifesto"
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
          :src="IMAGES.NUTRITION_CAFE"
          alt="From The Bar To The Kitchen"
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
          From The Bar To The Kitchen
        </h3>
        <ul
          class="space-y-6 text-sm md:text-base text-muted-foreground font-light"
        >
          <li>
            <strong class="text-foreground font-medium block mb-1">&bull; The Beverage Bar | High-Velocity Fluid Recovery:</strong>
            Located at the sanctuary entrance for seamless grab-and-go or app
            pre-ordering. Our baristas specialize in clean espresso,
            zero-fructose green juices, and post-workout protein formulas
            utilizing clean isolates and adaptogens.
          </li>
          <li>
            <strong class="text-foreground font-medium block mb-1">&bull; The Production Kitchen | Whole-Food Mastery:</strong>
            Tucked away to preserve the acoustic calm of the lounge, our kitchen
            line executes hot, savory mains, air-fried protein sandos, and
            dense, scoopable green and antioxidant smoothie bowls.
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
          The Nutrition Clinic
        </h3>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-6"
        >
          Biohacking is incomplete without personal strategy. Cafe NORI houses
          an <strong>On-Site Expert Nutritionist</strong> to align your daily
          dietary habits directly with your physical performance goals. Private
          consultations can be booked effortlessly via the KORA App, our digital
          portal, or at the primary sanctuary reception.
        </p>
        <p class="font-semibold text-foreground text-sm md:text-base mb-2">
          Hours of Alignment:
        </p>
        <ul
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-8 space-y-1"
        >
          <li>&bull; Doors Open: 6:00 AM</li>
          <li>&bull; Last Order: 9:30 PM</li>
          <li>&bull; Sanctuary Closes: 10:00 PM</li>
        </ul>
        <div class="sm:w-fit">
          <base-button to="tel:+9779818000015">
            BOOK CONSULTATION
          </base-button>
        </div>
      </div>
      <div
        class="w-full h-[32vh] sm:h-[40vh] md:h-[46vh] lg:h-full relative overflow-hidden group order-1 lg:order-2"
      >
        <img
          :src="IMAGES.NUTRITION_FUNCTIONAL"
          alt="The Nutrition Clinic"
          class="w-full h-full object-cover transition-transform duration-[6000ms] ease-out-quad group-hover:scale-105"
        >
        <div
          class="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none"
        />
      </div>
    </section>

    <!-- FAQ Section -->
    <!-- <section class="p-8 sm:py-20 sm:px-28">
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
    </section> -->

    <!-- Footer CTA Section -->
    <section
      class="relative py-28 md:py-36 px-6 overflow-hidden bg-background dark:bg-secondary-900 text-center flex flex-col items-center justify-center"
    >
      <!-- Foliage Decal -->
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

          <!-- CTA Buttons -->
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
/* High-end custom cubic bezier transition timing */
.ease-out-quad {
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
</style>
