<script setup lang="ts">
// Page setup
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center transition-all duration-300">
    <div class="flex flex-col items-center gap-6 max-w-2xl">
      <!-- Tag / Badge -->
      <span class="text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold text-primary bg-primary-50 dark:bg-stone-900 border border-primary/20 px-4 py-2 rounded-full shadow-sm">
        Welcome to the sanctuary
      </span>
      
      <!-- Premium Header -->
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-secondary-900 dark:text-stone-100 tracking-tight leading-tight">
        Chaos of the City,<br />
        <span class="text-primary font-normal italic font-serif">Clarity of the Self</span>
      </h1>
      
      <!-- Subtitle -->
      <p class="text-base md:text-lg text-stone-500 dark:text-stone-400 font-sans max-w-xl leading-relaxed mt-2">
        Kora is a premium urban escape. Start your journey towards deep restoration, tailored physical recovery, and high-performance physical culture.
      </p>
      
      <!-- CTAs -->
      <div class="flex flex-col sm:flex-row items-center gap-4 mt-6">
        <base-button to="/sessions" variant="solid" color="primary">
          Book Session
        </base-button>
        <base-button to="/offerings" variant="outline" color="primary">
          Explore Spaces
        </base-button>
      </div>
    </div>
  </div>
</template>
