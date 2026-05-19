<script setup lang="ts">
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "home",
});

const isLoaded = ref(false);
onMounted(() => {
  // Trigger the elegant fade-in and slow zoom entrance animation
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});
</script>

<template>
  <div class="min-h-screen bg-[#0D0D0E] text-foreground font-sans">
    <!-- Hero Section (Exactly 100vh height) -->
    <div
      class="h-screen w-full relative overflow-hidden bg-stone-950 select-none"
    >
      <!-- Immersive Background Image with Premium Slow-Zoom & Fade Entrance Animation -->
      <img
        :src="IMAGES.HOME_HERO"
        alt="Kora Spa Sanctuary"
        class="absolute inset-0 w-full h-full object-cover transition-all duration-8000 ease-out-quad"
        :class="isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'"
      />

      <!-- Luxury Dark Overlay Layer 1: Top-to-Bottom Linear Gradient (Header Legibility) -->
      <div
        class="absolute inset-x-0 top-0 h-[25vh] bg-linear-to-b from-stone-950/95 via-stone-950/40 to-transparent pointer-events-none transition-opacity duration-1000 delay-300"
        :class="isLoaded ? 'opacity-100' : 'opacity-0'"
      ></div>

      <!-- Luxury Dark Overlay Layer 2: Bottom-to-Top Linear Gradient (Rich Base Shadow) -->
      <div
        class="absolute inset-x-0 bottom-0 h-[30vh] bg-linear-to-t from-stone-950/95 via-stone-950/45 to-transparent pointer-events-none transition-opacity duration-1000 delay-300"
        :class="isLoaded ? 'opacity-100' : 'opacity-0'"
      ></div>

      <!-- Luxury Dark Overlay Layer 3: Radial Vignette (Deep Ambient Spa Glow & Center Focus) -->
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_15%,rgba(0,0,0,0.5)_60%,rgba(0,0,0,0.85)_100%)] pointer-events-none transition-opacity duration-1500 delay-200"
        :class="isLoaded ? 'opacity-100' : 'opacity-0'"
      ></div>
    </div>

    <!-- The Kora Experience Section -->
    <section
      class="relative bg-[#0D0D0E] py-24 md:py-32 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      <!-- Ambient background element: subtle leaf shape at top right, as seen in mockup! -->
      <div>
        <img
          :src="IMAGES.LEAF"
          alt="Subtle leaf background element"
          class="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 opacity-80 pointer-events-none translate-x-12 -translate-y-12 select-none z-10"
        />
      </div>

      <div
        class="max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
      >
        <!-- Left Column: Large meditative woman image -->
        <div class="lg:col-span-6 xl:col-span-6 flex justify-center">
          <div
            class="w-full max-w-[550px] aspect-4/5 rounded-[24px] overflow-hidden border border-stone-900 shadow-2xl relative group bg-stone-950"
          >
            <img
              :src="IMAGES.EXPERIENCE_MAIN"
              alt="The Kora Experience"
              class="w-full h-full object-cover transition-transform duration-6000 ease-out-quad group-hover:scale-105"
            />
            <!-- Premium subtle inner ring highlight -->
            <div
              class="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[24px] pointer-events-none"
            ></div>
          </div>
        </div>

        <!-- Right Column: Text & Small Cards Sub-Grid -->
        <div class="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
          <!-- Serif Luxury Header -->
          <h2
            class="font-serif text-3xl md:text-5xl text-stone-100 font-normal leading-tight tracking-wide mb-8"
          >
            The <span class="text-primary italic">Kora</span> Experience
          </h2>

          <!-- Copywriting Blocks -->
          <div
            class="space-y-4 text-stone-400 text-sm md:text-base font-light leading-relaxed mb-12 max-w-145"
          >
            <p>
              Our story begins in Nepal, where the ancient wisdom of balance and
              inner strength shaped our vision.
            </p>
            <p>
              We brought these timeless values to life at Club Kora - a space
              where wellness meets community. Here, members come to move,
              recover, and grow, guided by the Himalayan principles of mind,
              body, and spirit. That commitment to holistic well-being is why
              Club Kora exists, and why we'll continue nurturing this sanctuary
              for years to come.
            </p>
            <p>
              Guided by Himalayan principles of balance and inner strength, Kora
              is a modern sanctuary where movement, recovery and community meet.
              We help members grow their mind, body and spirit. We're here for
              the long run.
            </p>
          </div>

          <!-- Small Cards Grid -->
          <div class="grid grid-cols-3 gap-3 md:gap-4 max-w-145">
            <!-- Card 1: Aromatherapy -->
            <div
              class="aspect-2/3 rounded-[16px] overflow-hidden border border-stone-900 shadow-lg relative group bg-stone-950"
            >
              <img
                :src="IMAGES.EXPERIENCE_AROMA"
                alt="Aroma therapy"
                class="w-full h-full object-cover transition-transform duration-4000 ease-out-quad group-hover:scale-108"
              />
              <div
                class="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[16px] pointer-events-none"
              ></div>
            </div>

            <!-- Card 2: Rising Steam -->
            <div
              class="aspect-2/3 rounded-[16px] overflow-hidden border border-stone-900 shadow-lg relative group bg-stone-950"
            >
              <img
                :src="IMAGES.EXPERIENCE_STEAM"
                alt="Recovery steam"
                class="w-full h-full object-cover transition-transform duration-4000 ease-out-quad group-hover:scale-108"
              />
              <div
                class="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[16px] pointer-events-none"
              ></div>
            </div>

            <!-- Card 3: Wellness Food & Menu -->
            <div
              class="aspect-2/3 rounded-[16px] overflow-hidden border border-stone-900 shadow-lg relative group bg-stone-950"
            >
              <img
                :src="IMAGES.EXPERIENCE_FOOD"
                alt="Wellness nutrition"
                class="w-full h-full object-cover transition-transform duration-4000 ease-out-quad group-hover:scale-108"
              />
              <div
                class="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[16px] pointer-events-none"
              ></div>
            </div>
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
