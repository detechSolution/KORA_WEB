<script setup lang="ts">
import type { GiftCategory } from "~/stores/gift";
import { storeToRefs } from "pinia";
import { useGiftStore } from "~/stores/gift";
import { IMAGES } from "~/utils/images";

definePageMeta({ layout: "default" });
useSeoMeta({
  title: "Kora | Gift Card",
  description: "Share the Kora ritual. Explore memberships, spa services and classes for someone special.",
});

const giftStore = useGiftStore();
const { activeCategory } = storeToRefs(giftStore);
const categories: { id: GiftCategory; name: string; description: string }[] = [
  { id: "membership", name: "Gift Membership & Pass", description: "Gift membership plans & passes" },
  { id: "spa", name: "Gift Spa Services", description: "Gift multiple spa offerings" },
  { id: "classes", name: "Gift Kora Classes", description: "Gift various Kora classes" },
];
</script>

<template>
  <div class="relative w-full min-h-screen overflow-hidden bg-background text-foreground dark:bg-secondary-900 dark:text-white pb-16">
    <img
      :src="IMAGES.LEAF"
      alt=""
      class="pointer-events-none absolute -left-16 -top-20 w-56 md:w-80 lg:w-96 -scale-x-100 rotate-12 opacity-40"
      aria-hidden="true"
    >
    <img
      :src="IMAGES.LEAF"
      alt=""
      class="pointer-events-none absolute -right-16 top-16 w-48 md:w-72 lg:w-88 -rotate-12 opacity-40"
      aria-hidden="true"
    >

    <header class="relative max-w-4xl mx-auto px-6 pt-12 md:pt-20 pb-12 md:pb-20 text-center">
      <p class="text-[10px] md:text-xs text-primary uppercase tracking-widest mb-6">
        Kora Gift Card
      </p>
      <h1 class="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal leading-[1.05]">
        Share The Kora
        <span class="block text-primary italic mt-2">Ritual</span>
      </h1>
      <p class="max-w-xl mx-auto mt-8 text-sm text-secondary-500 leading-relaxed">
        Share the Kora experience. A Kora gift card is a gateway to curated wellness and personal transformation, offering the freedom to choose from our selection of products and experiences.
      </p>
    </header>

    <div class="relative max-w-400 mx-auto px-4 md:px-8 lg:px-12">
      <base-section-label
        label="Choose Your Gift"
        align="center"
        class="mb-10 md:mb-16"
      />
      <div
        role="group"
        aria-label="Choose your gift"
        class="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8"
      >
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          :aria-pressed="activeCategory === category.id"
          aria-controls="gift-catalogue"
          class="relative overflow-hidden border px-4 py-5 md:py-6 text-center cursor-pointer transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
          :class="activeCategory === category.id ? 'border-primary bg-[#C9A55A1A]' : 'border-border bg-card'"
          @click="giftStore.selectCategory(category.id)"
        >
          <img
            v-if="activeCategory === category.id"
            :src="IMAGES.GIFT"
            alt=""
            class="pointer-events-none absolute left-0 bottom-0 size-18"
            aria-hidden="true"
          >
          <span class="relative block font-serif text-lg md:text-xl">{{ category.name }}</span>
          <span class="relative block mt-2 text-xs text-secondary-500">{{ category.description }}</span>
        </button>
      </div>

      <section id="gift-catalogue" :aria-label="categories.find(category => category.id === activeCategory)?.name">
        <KeepAlive>
          <MembershipCatalogue v-if="activeCategory === 'membership'" gifting />
          <SpaCatalogue v-else-if="activeCategory === 'spa'" gifting />
          <GiftClasses v-else />
        </KeepAlive>
      </section>
    </div>
  </div>
</template>
