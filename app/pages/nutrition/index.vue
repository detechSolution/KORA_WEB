<script setup lang="ts">
import { nutritionOfferings } from "~/data/nutrition";
import { IMAGES } from "~/utils/images";

const faqs = [
  {
    label: "Is the ice bath suitable for beginners?",
    content:
      "Yes, our ice bath is suitable for beginners. We provide guidance on how to safely start and gradually increase your exposure.",
  },
  {
    label: "How much does recovery access cost at Nirvana Life Bali?",
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
  title: "Kora | Nutrition",
  description:
    "Kora's nutrition philosophy centers on nourishing the body with wholesome, balanced meals that support overall health and well-being.",
});
</script>

<template>
  <div
    class="bg-background dark:bg-secondary-900 text-foreground font-sans select-none min-h-screen"
  >
    <!-- Hero Section -->
    <div class="relative mb-16">
      <class-header label="" title="Nutrition">
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed text-justify"
        >
          Kora's nutrition philosophy centers on nourishing the body with
          wholesome, balanced meals that support overall health and well-being.
          Our culinary offerings are crafted with a focus on fresh, seasonal
          ingredients, thoughtfully prepared to provide both flavor and
          nourishment. Whether you're seeking a light, energizing meal or a
          hearty, restorative dish, Kora's nutrition options are designed to
          complement your wellness journey and fuel your body for optimal
          performance and recovery.
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

    <!-- Dynamic Nutrition Offerings -->
    <section
      v-for="(offering, index) in nutritionOfferings"
      :key="offering.id"
      class="w-full lg:h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden"
    >
      <!-- Image Column -->
      <div
        class="w-full h-[50vh] lg:h-full relative overflow-hidden group"
        :class="[index % 2 === 0 ? 'order-1' : 'order-1 lg:order-2']"
      >
        <img
          :src="offering.image"
          :alt="offering.imageAlt"
          class="w-full h-full object-cover transition-transform duration-[6000ms] ease-out-quad group-hover:scale-105"
        >
        <div
          class="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none"
        />
      </div>

      <!-- Text Column -->
      <div
        class="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 lg:py-0"
        :class="[index % 2 === 0 ? 'order-2' : 'order-2 lg:order-1']"
      >
        <h3
          class="font-serif text-3xl md:text-4xl text-foreground font-normal leading-tight tracking-wide mb-6"
        >
          {{ offering.title }}
        </h3>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed"
        >
          {{ offering.description }}
        </p>
      </div>
    </section>

    <!-- FAQ Section -->
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
