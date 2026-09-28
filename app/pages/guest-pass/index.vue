<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "~/composables/use-notification";
import { useAuthStore } from "~/stores/auth";
import { IMAGES } from "~/utils/images";

definePageMeta({ layout: "default" });
useSeoMeta({
  title: "Kora | Guest Pass",
  description: "A Kora guest pass is a special invitation, providing access to our curated wellness services.",
});

const authStore = useAuthStore();
const router = useRouter();
const { error: showError } = useNotification();
const isModalOpen = ref(false);

function openModal() {
  if (!authStore.isAuthenticated) {
    router.push({ path: "/login", query: { redirect: "/guest-pass" } });
    return;
  }

  // Guest pass requires an active membership. Check that the membership
  // exists and that today falls within its validFrom–validTo window.
  const userDetail = JSON.parse(localStorage.getItem("user_data") || "{}");
  const membership = userDetail?.membership;
  const todayStr = new Date().toLocaleDateString("en-CA");
  const isMembershipValidToday = membership?.membershipPlanId
    && membership?.validFrom && membership?.validTo
    && todayStr >= membership.validFrom.slice(0, 10)
    && todayStr <= membership.validTo.slice(0, 10);

  if (!isMembershipValidToday) {
    showError({
      message: "You need an active membership to create a guest pass.",
    });
    return;
  }

  isModalOpen.value = true;
}
</script>

<template>
  <div class="relative w-full overflow-hidden bg-background text-foreground dark:bg-secondary-900 dark:text-white">
    <!-- Leaf decorations -->
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

    <!-- Hero Section -->
    <section
      class="relative flex flex-col items-center justify-center text-center px-6 py-24"
    >
      <p class="text-[10px] md:text-xs text-primary uppercase tracking-widest mb-6 font-semibold">
        Kora Guest Pass
      </p>

      <h1 class="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal leading-[1.05] mb-2">
        Share The Kora
      </h1>
      <h2 class="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal italic text-primary leading-[1.1] mb-10">
        Journey
      </h2>

      <p class="max-w-xl mx-auto text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed mb-12">
        A Kora guest pass is a special invitation, providing access to our curated wellness services.
        This offers guests a personalized opportunity to experience the Kora lifestyle first-hand.
      </p>

      <base-button
        class="uppercase text-[11px] tracking-widest font-bold px-10 rounded-none"
        @click="openModal"
      >
        Create Guest Pass
      </base-button>
    </section>

    <!-- Guest Pass Modal -->
    <MembershipGuestPassModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @created="isModalOpen = false"
    />
  </div>
</template>
