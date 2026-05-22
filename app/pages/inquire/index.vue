<script setup lang="ts">
import { reactive } from "vue";
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Inquire For Residency",
  description:
    "Connect with Kora to begin your residency inquiry and explore a more intentional way of living.",
});

const inquiryForm = reactive({
  fullName: "",
  phone: "",
  email: "",
  inquiry: "",
});

const contactItems = [
  {
    icon: "i-lucide-mail",
    label: "Email",
    value: "kora@gmail.com",
    href: "mailto:kora@gmail.com",
    external: false,
  },
  {
    icon: "i-lucide-phone",
    label: "Phone",
    value: "01-4785467, 9845787654",
    href: "tel:+97714785467",
    external: false,
  },
  {
    icon: "i-lucide-map-pin",
    label: "Address",
    value: "Golfutar, Budhanilkantha-08, Kathmandu 44600",
  },
  {
    icon: "i-lucide-instagram",
    label: "Instagram",
    value: "@lifeatkora",
    href: "https://instagram.com",
    external: true,
  },
];

const submitInquiry = () => {
  console.log("Residency inquiry submitted", { ...inquiryForm });
};
</script>

<template>
  <section
    class="relative bg-background dark:bg-secondary-900 text-foreground dark:text-white transition-colors duration-300"
  >
    <div
      class="absolute top-0 right-0 pointer-events-none select-none opacity-35 md:opacity-45"
    >
      <img
        :src="IMAGES.LEAF"
        alt="Kora foliage decoration"
        class="w-full h-full object-cover translate-x-10 -translate-y-10"
      />
    </div>

    <ClassHeader
      label="Inquiry Application"
      title="Inquire For Residency"
      class=""
    />
    <div class="relative z-10 max-w-400 mx-auto px-4 md:px-8 lg:px-12">
      <div class="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12 py-12">
        <div class="space-y-6 lg:col-span-1">
          <p
            class="max-w-sm text-sm md:text-[15px] leading-7 text-foreground/75 dark:text-white/70"
          >
            Contact us directly for more information, and our team will be happy
            to assist you with any questions or guidance you may need.
          </p>

          <div
            class="border border-border bg-card/70 dark:bg-card px-5 py-6 md:px-6 md:py-7"
          >
            <p
              class="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary"
            >
              Direct Contact
            </p>

            <div class="mt-6 space-y-5">
              <div
                v-for="item in contactItems"
                :key="item.label"
                class="flex items-start gap-3 text-sm text-foreground/75 dark:text-white/75"
              >
                <UIcon
                  :name="item.icon"
                  class="mt-0.5 h-4 w-4 shrink-0 text-primary"
                />

                <a
                  v-if="item.href"
                  :href="item.href"
                  :target="item.external ? '_blank' : undefined"
                  :rel="item.external ? 'noopener noreferrer' : undefined"
                  class="leading-6 transition-colors duration-200 hover:text-primary"
                >
                  {{ item.value }}
                </a>

                <p v-else class="leading-6">
                  {{ item.value }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2">
          <p class="text-lg font-semibold uppercase text-primary-700">
            Inquiry Application
          </p>

          <form class="mt-6 space-y-5" @submit.prevent="submitInquiry">
            <div class="grid gap-5 md:grid-cols-2">
              <base-input
                v-model="inquiryForm.fullName"
                name="fullName"
                label="Full Name"
                placeholder="Your Name"
              />

              <base-input
                v-model="inquiryForm.phone"
                name="phone"
                type="tel"
                label="Phone"
                placeholder="Your Phone Number"
              />
            </div>

            <base-input
              v-model="inquiryForm.email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="Your email address"
            />

            <base-input
              v-model="inquiryForm.inquiry"
              name="inquiry"
              type="textarea"
              label="Your Inquiry For Kora"
              placeholder="What Transformation Are You Seeking?"
            />

            <base-button
              type="submit"
              class="w-full justify-center text-xs uppercase tracking-[0.18em]"
            >
              Submit Inquiry
            </base-button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
