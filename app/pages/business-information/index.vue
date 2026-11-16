<script setup lang="ts">
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Business Information",
  description:
    "Business and regulatory information for KORA, operated by Sam's Fitness Pvt. Ltd. in Kathmandu, Nepal.",
});

const disclosures = [
  {
    number: "01",
    title: "Business identity",
    intro:
      "The following operating entity is identified in KORA's published membership waiver.",
    rows: [
      { label: "Operating entity", value: "Sam's Fitness Pvt. Ltd." },
      { label: "Consumer-facing name", value: "KORA Wellness Sanctuary" },
      {
        label: "Business activity",
        value: "Wellness, fitness, movement and recovery services",
      },
      { label: "Operating location", value: "Kathmandu, Nepal" },
    ],
  },
  {
    number: "02",
    title: "Services & transactions",
    intro:
      "KORA provides services and bookings through its website and sanctuary. Service terms are available before purchase.",
    rows: [
      {
        label: "Services offered",
        value:
          "Memberships, classes, wellness and recovery services, and curated events",
      },
      {
        label: "Bookings & purchases",
        value: "Online and through the KORA sanctuary concierge",
      },
      {
        label: "Customer terms",
        value:
          "Refer to the Terms & Conditions for booking, payment and cancellation details.",
      },
    ],
    link: { label: "Read Terms & Conditions", href: "/policy" },
  },
  {
    number: "03",
    title: "Regulatory details",
    intro:
      "This page is intended to make essential business information easy to find. Registration particulars are not published in the materials currently available on this website.",
    rows: [
      {
        label: "Company registration number",
        value: "Please contact KORA for current details.",
      },
      {
        label: "PAN / VAT number",
        value: "Please contact KORA for current details.",
      },
      {
        label: "Registered office address",
        value: "Please contact KORA for current details.",
      },
    ],
  },
];
</script>

<template>
  <main
    class="business-information-page relative isolate min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300 dark:bg-secondary-900"
  >
    <div
      class="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-between overflow-hidden opacity-20 md:opacity-30"
      aria-hidden="true"
    >
      <img
        :src="IMAGES.LEAF"
        alt=""
        class="-ml-24 -mt-16 h-64 w-64 -scale-x-100 object-cover md:h-96 md:w-96"
      >
      <img
        :src="IMAGES.LEAF"
        alt=""
        class="-mr-24 -mt-16 h-64 w-64 object-cover md:h-96 md:w-96"
      >
    </div>

    <div class="mx-auto max-w-7xl px-5 pb-20 pt-14 md:px-10 md:pb-28 md:pt-24">
      <header
        class="mx-auto max-w-4xl border-b border-border pb-10 text-center md:pb-14"
      >
        <p
          class="mb-5 text-[10px] font-medium uppercase tracking-[0.35em] text-primary md:text-xs"
        >
          KORA · Kathmandu, Nepal
        </p>
        <h1
          class="font-serif text-4xl font-normal leading-tight tracking-wide text-secondary dark:text-white md:text-6xl"
        >
          Business Information
        </h1>
        <p
          class="mx-auto mt-6 max-w-2xl text-sm font-light leading-7 text-muted-foreground md:text-base"
        >
          Clear information about the business behind KORA, our services, and
          how to reach us with questions.
        </p>
        <p
          class="mt-6 text-[11px] uppercase tracking-[0.2em] text-secondary-500 dark:text-secondary-400"
        >
          Last updated · November 2026
        </p>
      </header>

      <div
        class="mx-auto mt-12 grid max-w-6xl gap-14 lg:mt-16 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20"
      >
        <aside class="hidden lg:block">
          <p
            class="mb-5 text-[10px] font-medium uppercase tracking-[0.25em] text-primary"
          >
            On this page
          </p>
          <nav
            aria-label="Page sections"
            class="sticky top-28 flex flex-col gap-4"
          >
            <a
              v-for="item in disclosures"
              :key="item.number"
              :href="`#section-${item.number}`"
              class="text-sm font-light text-muted-foreground transition-colors hover:text-primary"
            >
              <span class="mr-3 font-mono text-xs text-primary">{{
                item.number
              }}</span>{{ item.title }}
            </a>
            <a
              href="#contact"
              class="text-sm font-light text-muted-foreground transition-colors hover:text-primary"
            ><span class="mr-3 font-mono text-xs text-primary">04</span>Contact</a>
          </nav>
        </aside>

        <div class="min-w-0">
          <section class="mb-12 border-l-2 border-primary/60 pl-5 md:pl-7">
            <p
              class="max-w-3xl text-sm font-light leading-7 text-secondary-700 dark:text-secondary-200 md:text-base"
            >
              KORA is operated by Sam's Fitness Pvt. Ltd. We aim to make our
              business identity and service information straightforward to
              access. For official records or regulatory details not listed
              here, please contact our team.
            </p>
          </section>

          <section
            v-for="section in disclosures"
            :id="`section-${section.number}`"
            :key="section.number"
            class="mb-14 scroll-mt-28 last:mb-0"
          >
            <div class="mb-5 flex items-start gap-4 md:gap-6">
              <span
                class="pt-1 font-mono text-xs tracking-wider text-primary"
              >{{ section.number }}</span>
              <div>
                <h2
                  class="font-serif text-2xl font-normal tracking-wide text-secondary dark:text-white md:text-3xl"
                >
                  {{ section.title }}
                </h2>
                <p
                  class="mt-3 max-w-3xl text-sm font-light leading-6 text-muted-foreground"
                >
                  {{ section.intro }}
                </p>
              </div>
            </div>

            <dl
              class="ml-8 divide-y divide-border border-y border-border md:ml-10"
            >
              <div
                v-for="row in section.rows"
                :key="row.label"
                class="grid gap-1 py-4 sm:grid-cols-[minmax(150px,0.8fr)_minmax(0,1.6fr)] sm:gap-8 md:py-5"
              >
                <dt
                  class="text-xs font-medium uppercase tracking-[0.12em] text-secondary-500 dark:text-secondary-300"
                >
                  {{ row.label }}
                </dt>
                <dd
                  class="text-sm font-light leading-6 text-secondary-800 dark:text-secondary-100"
                >
                  {{ row.value }}
                </dd>
              </div>
            </dl>
            <NuxtLink
              v-if="section.link"
              :to="section.link.href"
              class="ml-8 mt-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-primary transition-colors hover:text-primary-700 md:ml-10"
            >
              {{ section.link.label }}<span aria-hidden="true">↗</span>
            </NuxtLink>
          </section>

          <section
            id="contact"
            class="mt-14 scroll-mt-28 border-t border-border pt-8 md:mt-16 md:pt-10"
          >
            <p
              class="mb-3 text-[10px] font-medium uppercase tracking-[0.25em] text-primary"
            >
              <span class="font-mono text-xs tracking-wider">04</span> · Contact
            </p>
            <h2
              class="font-serif text-2xl font-normal tracking-wide text-secondary dark:text-white md:text-3xl"
            >
              Questions or concerns
            </h2>
            <p
              class="mt-3 max-w-2xl text-sm font-light leading-7 text-muted-foreground"
            >
              For questions about KORA, our services, or the information on this
              page, please reach out through our contact page. Our team will be
              happy to assist.
            </p>
            <NuxtLink
              to="/inquire"
              class="mt-5 inline-flex items-center gap-2 border-b border-primary pb-1 text-xs font-medium uppercase tracking-[0.12em] text-primary transition-colors hover:text-primary-700"
            >
              Contact KORA <span aria-hidden="true">↗</span>
            </NuxtLink>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.business-information-page {
  scroll-behavior: auto;
}

@media (prefers-reduced-motion: reduce) {
  :global(html) {
    scroll-behavior: auto;
  }
}

:global(html) {
  scroll-behavior: smooth;
}
</style>
