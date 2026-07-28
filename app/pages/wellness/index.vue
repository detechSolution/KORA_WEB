<script setup lang="ts">
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Kora | Wellness",
  description:
    "The Art of Stillness. The Science of Human Longevity. Where Performance Meets Absolute Silence.",
});
</script>

<template>
  <div
    class="bg-background dark:bg-secondary-900 text-foreground font-sans min-h-screen"
  >
    <!-- Hero Section -->
    <div class="relative mb-16">
      <class-header label="" title="Wellness">
        <div class="space-y-6 mt-8">
          <p
            class="text-muted-foreground font-light text-sm md:text-base leading-relaxed text-justify"
          >
            Exertion is only half the continuum. True vitality lies in the
            discipline of recovery. Conceived as a private architectural refuge
            above the kinetic noise of Kathmandu,
            <strong class="text-foreground font-medium">KORA</strong> brings
            together high-altitudes biohacking, contrast thermal therapy, and
            the ancient master bodywork of
            <strong class="text-foreground font-medium">NUAD THAI</strong>.
          </p>
          <p
            class="text-muted-foreground font-light text-sm md:text-base leading-relaxed text-justify"
          >
            A singular ecosystem designed for those who measure life in peak
            experiences, restored energy, and intentional longevity.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 pt-8">
            <base-button to="/schedules">
              RESERVE YOUR RITUAL
            </base-button>
            <base-button variant="outline" to="/spa">
              EXPLORE THE SANCTUARY MENU
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

    <!-- Philosophy Section -->
    <section
      class="w-full lg:h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-background dark:bg-secondary-900"
    >
      <div
        class="w-full h-[50vh] lg:h-full relative overflow-hidden group order-1"
      >
        <img
          :src="IMAGES.WELLNESS_CLASS"
          alt="Reclaiming The Space Between"
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
          Reclaiming The Space Between.
        </h3>
        <div
          class="space-y-6 mb-10 text-muted-foreground font-light text-sm md:text-base leading-relaxed"
        >
          <p>
            Modern luxury is no longer about distraction; it is about
            subtraction. It is the deliberate removal of digital friction,
            physical tension, and cognitive overload. At KORA, wellness is not
            treated as a disjointed pampering service. It is engineered as an
            integrated recovery ritual. By placing physical training, deliberate
            thermal exposure, and structural bodywork under one roof, we
            eliminate the boundaries between effort and restoration.
          </p>
          <p>
            Here, your heart rate slows, cellular repair begins, and the central
            nervous system returns to equilibrium.
          </p>
        </div>
        <div class="sm:w-fit">
          <base-button to="/spa">
            EXPERIENCE THE RITUAL
          </base-button>
        </div>
      </div>
    </section>

    <!-- Pillars Overview -->
    <section class="py-24 px-6 md:px-12 lg:px-24">
      <div class="max-w-6xl mx-auto text-center">
        <h2
          class="font-serif text-3xl md:text-4xl mb-16 tracking-wide text-foreground"
        >
          THE THREE PILLARS OF RESTORATION
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div class="border-t border-foreground/20 pt-8">
            <span class="block text-sm font-mono mb-4 text-muted-foreground">01</span>
            <h3
              class="font-serif text-lg mb-2 uppercase tracking-widest text-foreground"
            >
              THE THERMAL CIRCUIT
            </h3>
            <p class="text-xs text-primary uppercase tracking-widest">
              CONTRAST HYDROTHERAPY
            </p>
          </div>
          <div class="border-t border-foreground/20 pt-8">
            <span class="block text-sm font-mono mb-4 text-muted-foreground">02</span>
            <h3
              class="font-serif text-lg mb-2 uppercase tracking-widest text-foreground"
            >
              THE BODYWORK LAB
            </h3>
            <p class="text-xs text-primary uppercase tracking-widest">
              NUAD THAI THERAPIES
            </p>
          </div>
          <div class="border-t border-foreground/20 pt-8">
            <span class="block text-sm font-mono mb-4 text-muted-foreground">03</span>
            <h3
              class="font-serif text-lg mb-2 uppercase tracking-widest text-foreground"
            >
              DERMAL ARTISTRY
            </h3>
            <p class="text-xs text-primary uppercase tracking-widest">
              CELLULAR POLISHES
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pillar 01: Thermal Circuit -->
    <section
      class="w-full lg:h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-background dark:bg-secondary-900"
    >
      <div
        class="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 lg:py-0 order-2 lg:order-1 relative overflow-hidden"
      >
        <div
          class="absolute bottom-0 left-0 w-96 h-96 opacity-20 pointer-events-none translate-y-1/2 -translate-x-1/4"
        >
          <img
            :src="IMAGES.LEAF"
            alt="leaf decoration"
            class="w-full h-full object-cover"
          >
        </div>
        <div class="relative z-10">
          <h3
            class="font-serif text-3xl md:text-4xl text-foreground font-normal leading-tight tracking-wide mb-6"
          >
            01. The Advanced Thermal<br>Circuit
          </h3>
          <p
            class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-8"
          >
            Deliberate fire and ice protocols engineered to trigger autonomic
            nervous system down regulation, optimize vascular tone, and
            accelerate cellular flushing.
          </p>
          <ul
            class="space-y-6 text-sm md:text-base text-muted-foreground font-light mb-8"
          >
            <li class="flex items-start">
              <span
                class="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 mr-4 shrink-0"
              />
              <div>
                <strong class="text-foreground font-medium block mb-1">Dry Finnish Sauna Suite</strong>
                <p>
                  Deep, dry thermal exposure that accelerates heartrate
                  variability (HRV), promotes shock-protein release, and purges
                  deep metabolic impurities.
                </p>
              </div>
            </li>
            <li class="flex items-start">
              <span
                class="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 mr-4 shrink-0"
              />
              <div>
                <strong class="text-foreground font-medium block mb-1">Cold Plunge (10 degree celcius) & Hydro-Jacuzzi</strong>
                <p>
                  Precision-calibrated cold water immersion to immediately halt
                  acute muscular inflammation, paired with targeted warm
                  hydrotherapy to drive systemic circulation.
                </p>
              </div>
            </li>
          </ul>
          <div class="sm:w-fit">
            <base-button to="/recovery">
              EXPLORE THERMAL SUITES
            </base-button>
          </div>
        </div>
      </div>
      <div
        class="w-full h-[50vh] lg:h-full relative overflow-hidden group order-1 lg:order-2"
      >
        <img
          :src="IMAGES.WELLNESS_SAUNA"
          alt="The Advanced Thermal Circuit"
          class="w-full h-full object-cover transition-transform duration-[6000ms] ease-out-quad group-hover:scale-105"
        >
        <div
          class="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none"
        />
      </div>
    </section>

    <!-- Pillar 02: Bodywork Lab -->
    <section
      class="w-full lg:h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-background dark:bg-secondary-900"
    >
      <div
        class="w-full h-[50vh] lg:h-full relative overflow-hidden group order-1"
      >
        <img
          :src="IMAGES.WELLNESS_SPA"
          alt="The Bodywork Lab"
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
          02. The Bodywork Lab By<br>NUAD THAI
        </h3>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-8"
        >
          An uncompromising fusion of ancient Thai medicinal movement and modern
          biomechanical alignment. Delivered by certified master practitioners,
          each treatment is tailored to your specific training load, posture,
          and neurological stress.
        </p>
        <ul
          class="space-y-6 text-sm md:text-base text-muted-foreground font-light mb-8"
        >
          <li class="flex items-start">
            <span
              class="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 mr-4 shrink-0"
            />
            <div>
              <strong class="text-foreground font-medium block mb-1">Nuad Thai Traditional</strong>
              <p>
                A dry, oil-free physical alignment combining rhythmic
                acupressure with passive, yoga-based assisted stretching to
                release deep fascia and restore joint mobility.
              </p>
            </div>
          </li>
          <li class="flex items-start">
            <span
              class="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 mr-4 shrink-0"
            />
            <div>
              <strong class="text-foreground font-medium block mb-1">Ultimate Thai & Deep Tissue</strong>
              <p>
                An intense, restorative hybrid of energy-line compression and
                targeted structural oil strokes to unbind chronic physical knots
                and flush tissue waste.
              </p>
            </div>
          </li>
          <li class="flex items-start">
            <span
              class="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 mr-4 shrink-0"
            />
            <div>
              <strong class="text-foreground font-medium block mb-1">Therapeutic Herbal Compress</strong>
              <p>
                Warm, steamed canvas pouches filled with wild Thai botanicals,
                radiating therapeutic heat deep into the muscle tissue to
                dissolve lingering fatigue.
              </p>
            </div>
          </li>
        </ul>
        <div class="sm:w-fit">
          <base-button to="/spa">
            VIEW TREATMENT RATES
          </base-button>
        </div>
      </div>
    </section>

    <!-- Pillar 03: Dermal Artistry -->
    <section
      class="w-full lg:h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-background dark:bg-secondary-900"
    >
      <div
        class="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 lg:py-0 order-2 lg:order-1"
      >
        <h3
          class="font-serif text-3xl md:text-4xl text-foreground font-normal leading-tight tracking-wide mb-6"
        >
          03. Dermal Artistry & Botanical<br>Polishes
        </h3>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-8"
        >
          Clinical skincare protocols and organic body treatments designed to
          nourish the skin barrier, encourage cellular turnover, and restore
          natural luminosity.
        </p>
        <ul
          class="space-y-6 text-sm md:text-base text-muted-foreground font-light mb-8"
        >
          <li class="flex items-start">
            <span
              class="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 mr-4 shrink-0"
            />
            <div>
              <strong class="text-foreground font-medium block mb-1">Targeted Facial Artistry</strong>
              <p>
                High-potency botanical treatments curated for structural skin
                health, including the radiant Goldsheen Facial, corrective
                Digmentone Therapy, and soothing Acnex Treatments.
              </p>
            </div>
          </li>
          <li class="flex items-start">
            <span
              class="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 mr-4 shrink-0"
            />
            <div>
              <strong class="text-foreground font-medium block mb-1">Exfoliating Botanical Polishes</strong>
              <p>
                Nutrient-dense body treatments utilizing ground organic coffee,
                raw coconut, jasmine oils, and sandalwood to awaken circulation
                and refine dermal texture.
              </p>
            </div>
          </li>
        </ul>
        <div class="sm:w-fit">
          <base-button to="/spa">
            VIEW FACIAL MENU
          </base-button>
        </div>
      </div>
      <div
        class="w-full h-[50vh] lg:h-full relative overflow-hidden group order-1 lg:order-2"
      >
        <img
          :src="IMAGES.WELLNESS_DERMAL"
          alt="Dermal Artistry"
          class="w-full h-full object-cover transition-transform duration-[6000ms] ease-out-quad group-hover:scale-105"
        >
        <div
          class="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none"
        />
      </div>
    </section>

    <!-- Sensory Architecture -->
    <section
      class="py-24 px-4 md:px-8 lg:px-12 bg-background dark:bg-secondary-900"
    >
      <div class="max-w-400 mx-auto">
        <p
          class="text-primary text-xs tracking-[0.2em] uppercase mb-4 font-semibold"
        >
          SENSORY ARCHITECTURE
        </p>
        <h3
          class="font-serif text-3xl md:text-4xl text-foreground font-normal leading-tight tracking-wide mb-6"
        >
          The Sanctuary Atmosphere
        </h3>
        <p
          class="text-muted-foreground font-light text-base md:text-lg leading-relaxed max-w-4xl"
        >
          Every square meter of KORA is governed by an invisible sensory
          protocol. Air filtered through mountain cedar notes, ambient acoustics
          tuned to calming frequencies, and soft, indirect lighting ensure that
          your body begins recovering the moment you cross the threshold.
        </p>
      </div>
    </section>

    <!-- Ways to Experience -->
    <section
      class="py-24 px-4 md:px-8 lg:px-12 bg-background dark:bg-secondary-900 border-t border-foreground/10"
    >
      <div class="max-w-400 mx-auto">
        <p
          class="text-primary text-xs tracking-[0.2em] uppercase mb-12 font-semibold"
        >
          WAYS TO EXPERIENCE KORA
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <!-- Left Column -->
          <div>
            <h3
              class="font-serif text-2xl md:text-3xl text-foreground font-normal leading-tight tracking-wide mb-6"
            >
              Member Allocation
            </h3>
            <p
              class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-8"
            >
              As a Kora Plus member, your access to deep relaxation and
              rejuvenation is seamless and effortless. Enjoy dedicated monthly
              spa credits automatically applied to your account, alongside
              priority booking windows that ensure you always secure your
              preferred appointment times. Flexibility is at the heart of the
              Kora Plus experience. Whether you want to treat a loved one,
              reward a team member, or host a guest, your allocated treatments
              are fully transferable. You can send spa sessions directly to
              family, friends, or business associates in seconds.
            </p>
            <div class="sm:w-fit">
              <base-button to="/membership">
                VIEW MEMBERSHIP
              </base-button>
            </div>
          </div>
          <!-- Right Column -->
          <div>
            <h3
              class="font-serif text-2xl md:text-3xl text-foreground font-normal leading-tight tracking-wide mb-6"
            >
              The Integrated Day Pass
            </h3>
            <p
              class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-6"
            >
              For non-members seeking sanctuary.
            </p>
            <ul
              class="space-y-4 text-muted-foreground font-light text-sm md:text-base mb-8"
            >
              <li class="flex items-start">
                <span
                  class="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2.5 mr-3 shrink-0"
                />
                <span><strong class="text-foreground font-medium">Spa-Inclusive Day Pass:</strong>
                  Complete access to KORA’s state-of-the-art training spaces,
                  thermal circuit, and swimming pool, seamlessly bundled with a
                  60 or 90-minute
                  <strong class="text-foreground font-medium">NUAD THAI ritual.</strong></span>
              </li>
              <li class="flex items-start">
                <span
                  class="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2.5 mr-3 shrink-0"
                />
                <span><strong class="text-foreground font-medium">Curated Gifting:</strong>
                  Private, bespoke digital vouchers available directly via KORA
                  app or concierge.</span>
              </li>
            </ul>
            <div class="sm:w-fit">
              <base-button to="/membership">
                PURCHASE DAY PASS
              </base-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <section
      class="relative py-28 md:py-36 px-6 overflow-hidden bg-background dark:bg-secondary-900 text-center flex flex-col items-center justify-center border-t border-foreground/10"
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
            Reclaim Your Equilibrium
          </h2>
          <p
            class="max-w-2xl text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-10 italic"
          >
            Your potential is only as high as your capacity to recover.
          </p>

          <!-- CTA Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <base-button to="/membership">
              APPLY FOR MEMBERSHIP
            </base-button>
            <base-button variant="outline" to="#">
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
