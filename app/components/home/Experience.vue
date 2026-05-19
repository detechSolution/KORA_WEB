<template>
  <!-- The Kora Experience Section -->
  <section class="relative bg-[#0D0D0E] py-24 md:py-32 px-6 md:px-12 lg:px-20 overflow-hidden select-none">
    <!-- Ambient background element: subtle leaf shape at top right, as seen in mockup! -->
    <div class="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 opacity-15 pointer-events-none translate-x-12 -translate-y-12 select-none z-10">
      <svg viewBox="0 0 100 100" class="w-full h-full fill-none stroke-stone-700 stroke-[0.4]">
        <path d="M10,90 Q40,40 90,10 M30,70 Q50,45 80,30 M50,50 Q65,30 85,20 M20,80 Q45,60 70,50 M60,40 Q75,25 90,15" />
      </svg>
    </div>

    <div class="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <!-- Left Column: Large meditative woman image -->
      <div class="lg:col-span-6 xl:col-span-6 flex justify-center">
        <div class="w-full max-w-[550px] aspect-[4/5] rounded-[24px] overflow-hidden border border-stone-900 shadow-2xl relative group bg-stone-950">
          <img 
            :src="IMAGES.EXPERIENCE_MAIN" 
            alt="The Kora Experience" 
            class="w-full h-full object-cover transition-transform duration-[6000ms] ease-out-quad group-hover:scale-105"
          />
          <!-- Premium subtle inner ring highlight -->
          <div class="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[24px] pointer-events-none"></div>
        </div>
      </div>

      <!-- Right Column: Text & Small Cards Sub-Grid -->
      <div class="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
        <!-- Serif Luxury Header -->
        <h2 class="font-serif text-3xl md:text-5xl text-stone-100 font-normal leading-tight tracking-wide mb-8">
          The <span class="text-primary italic">Kora</span> Experience
        </h2>

        <!-- Copywriting Blocks -->
        <div class="space-y-6 text-stone-400 text-sm md:text-base font-light leading-relaxed mb-12 max-w-[580px]">
          <p>
            Our story begins in Nepal, where the ancient wisdom of balance and inner strength shaped our vision.
          </p>
          <p>
            We brought these timeless values to life at Club Kora - a space where wellness meets community. Here, members come to move, recover, and grow, guided by the Himalayan principles of mind, body, and spirit. That commitment to holistic well-being is why Club Kora exists, and why we'll continue nurturing this sanctuary for years to come.
          </p>
          <p>
            Guided by Himalayan principles of balance and inner strength, Kora is a modern sanctuary where movement, recovery and community meet. We help members grow their mind, body and spirit. We're here for the long run.
          </p>
        </div>

        <!-- Small Cards Grid -->
        <div class="grid grid-cols-3 gap-3 md:gap-4 max-w-[580px]">
          <!-- Card 1: Aromatherapy -->
          <div class="aspect-[2/3] rounded-[16px] overflow-hidden border border-stone-900 shadow-lg relative group bg-stone-950">
            <img 
              :src="IMAGES.EXPERIENCE_AROMA" 
              alt="Aroma therapy" 
              class="w-full h-full object-cover transition-transform duration-[4000ms] ease-out-quad group-hover:scale-108"
            />
            <div class="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[16px] pointer-events-none"></div>
          </div>
          
          <!-- Card 2: Rising Steam -->
          <div class="aspect-[2/3] rounded-[16px] overflow-hidden border border-stone-900 shadow-lg relative group bg-stone-950">
            <img 
              :src="IMAGES.EXPERIENCE_STEAM" 
              alt="Recovery steam" 
              class="w-full h-full object-cover transition-transform duration-[4000ms] ease-out-quad group-hover:scale-108"
            />
            <div class="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[16px] pointer-events-none"></div>
          </div>

          <!-- Card 3: Wellness Food & Menu -->
          <div class="aspect-[2/3] rounded-[16px] overflow-hidden border border-stone-900 shadow-lg relative group bg-stone-950">
            <img 
              :src="IMAGES.EXPERIENCE_FOOD" 
              alt="Wellness nutrition" 
              class="w-full h-full object-cover transition-transform duration-[4000ms] ease-out-quad group-hover:scale-108"
            />
            <div class="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[16px] pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* High-end custom cubic bezier transition timing */
.ease-out-quad {
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
</style>
