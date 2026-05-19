<template>
  <section
    class="relative bg-[#0D0D0E] py-28 md:py-36 px-6 md:px-12 lg:px-20 overflow-hidden flex items-center justify-center min-h-[850px] lg:min-h-[900px] select-none"
  >
    <!-- Curated background tropical foliage layer -->
    <img
      :src="IMAGES.MANIFESTO_BACKGROUND"
      alt="Manifesto Background Texture"
      class="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-lighten select-none z-0"
    />

    <!-- Subtle gradient to blend borders with adjacent dark sections -->
    <!-- <div
      class="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0D0D0E] to-transparent pointer-events-none z-10"
    ></div>
    <div
      class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0D0D0E] to-transparent pointer-events-none z-10"
    ></div> -->

    <!-- Core Layout Container (Handles staggered absolute positions on desktop and grid on mobile) -->
    <div
      class="w-full max-w-[1450px] mx-auto relative min-h-[600px] md:min-h-[700px] flex items-start justify-center z-20"
    >
      <!-- Card 1: Meditation (Top Left) -->
      <div
        class="hidden lg:block absolute left-[3%] xl:left-[5%] top-[5%] w-[210px] xl:w-[300px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl z-20 transition-all duration-700 hover:-translate-y-2 hover:scale-[1.03] hover:border-primary-500/20 group"
      >
        <img
          :src="IMAGES.MANIFESTO_MEDITATION"
          alt="Meditation sanctuary"
          class="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-105"
        />
        <div
          class="absolute ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none"
        ></div>
      </div>

      <!-- Card 2: Crystals (Bottom Left) -->
      <div
        class="hidden lg:block absolute left-[12%] xl:left-[15%] bottom-[-1%] w-[210px] xl:w-[240px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl z-20 transition-all duration-700 hover:-translate-y-2 hover:scale-[1.03] hover:border-primary-500/20 group"
      >
        <img
          :src="IMAGES.MANIFESTO_CRYSTALS"
          alt="Holistic crystals"
          class="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-105"
        />
        <div
          class="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none"
        ></div>
      </div>

      <!-- Card 3: Wet Stone Spa Mist (Top Right) -->
      <div
        class="hidden lg:block absolute right-[3%] xl:right-[5%] top-[5%] w-[210px] xl:w-[300px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl z-20 transition-all duration-700 hover:-translate-y-2 hover:scale-[1.03] hover:border-primary-500/20 group"
      >
        <img
          :src="IMAGES.MANIFESTO_STEAM"
          alt="Volcanic stone steam"
          class="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-105"
        />
        <div
          class="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none"
        ></div>
      </div>

      <!-- Card 4: Singing Bowls (Bottom Right) -->
      <div
        class="hidden lg:block absolute right-[12%] xl:right-[15%] bottom-[-1%] w-[210px] xl:w-[240px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl z-20 transition-all duration-700 hover:-translate-y-2 hover:scale-[1.03] hover:border-primary-500/20 group"
      >
        <img
          :src="IMAGES.MANIFESTO_SINGING"
          alt="Tibetan singing bowls meditation"
          class="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-105"
        />
        <div
          class="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none"
        ></div>
      </div>

      <!-- Centered Manifesto Quote Block -->
      <div
        class="w-full max-w-[720px] px-6 text-center flex flex-col items-center justify-center relative z-30"
      >
        <!-- Gold Serif Quotes -->
        <span
          class="font-serif text-primary text-6xl md:text-7xl leading-none select-none mb-4"
          >”</span
        >

        <!-- Manifesto Title -->
        <h2
          class="font-serif text-3xl md:text-4xl lg:text-5xl text-stone-100 font-normal leading-snug tracking-wide mb-6"
        >
          We Do Not Sell Memberships;<br />
          We Facilitate <span class="text-primary italic">Metamorphosis</span>
        </h2>

        <!-- Manifesto Description -->
        <p
          class="text-stone-400 font-light text-sm md:text-base leading-relaxed max-w-[560px] mb-8 font-sans"
        >
          Kora is the bridge between the chaos of the city and the clarity of
          the self. 250 individuals. One collective sanctuary. A journey from
          effort to elegance.
        </p>

        <!-- Signature -->
        <span
          class="text-stone-500 tracking-[0.25em] font-sans text-[10px] md:text-xs font-semibold uppercase"
        >
          -THE KORA MANIFESTO
        </span>
      </div>
    </div>

    <!-- Mobile View Grid: Floating cards are laid out in a responsive grid below/above context -->
    <div
      class="w-full max-w-[650px] mx-auto grid grid-cols-2 gap-4 mt-8 lg:hidden px-6 relative z-20"
    >
      <div
        class="aspect-[3/4] rounded-2xl overflow-hidden border border-stone-900 manifesto-card"
      >
        <img
          :src="IMAGES.MANIFESTO_MEDITATION"
          alt="Meditation"
          class="w-full h-full object-cover"
        />
      </div>
      <div
        class="aspect-[3/4] rounded-2xl overflow-hidden border border-stone-900 manifesto-card mt-4"
      >
        <img
          :src="IMAGES.MANIFESTO_STEAM"
          alt="Spa Mist"
          class="w-full h-full object-cover"
        />
      </div>
      <div
        class="aspect-[3/4] rounded-2xl overflow-hidden border border-stone-900 manifesto-card -mt-4"
      >
        <img
          :src="IMAGES.MANIFESTO_CRYSTALS"
          alt="Crystals"
          class="w-full h-full object-cover"
        />
      </div>
      <div
        class="aspect-[3/4] rounded-2xl overflow-hidden border border-stone-900 manifesto-card"
      >
        <img
          :src="IMAGES.MANIFESTO_SINGING"
          alt="Singing Bowls"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* High-end custom cubic bezier transition timing */
.ease-out-quad {
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.manifesto-card {
  box-shadow: 0px 3.81px 6.38px 0px #00000069;
}
</style>
