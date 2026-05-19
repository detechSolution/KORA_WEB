<template>
  <section
    class="w-full bg-[#212121] relative py-4 md:py-4 px-6 md:px-6 lg:px-6 border-t border-stone-900"
  >
    <div
      class="mx-auto relative z-20 flex flex-col lg:flex-row gap-6 lg:gap-12 items-center justify-between"
    >
      <!-- Left side: Serif title -->
      <div class="flex items-center gap-3">
        <h4
          class="font-serif text-lg md:text-xl text-stone-200 tracking-wide font-normal"
        >
          Newsletter Sign Up
        </h4>
      </div>

      <!-- Right side: Sleek, horizontal form -->
      <form
        @submit.prevent
        class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center"
      >
        <input
          type="text"
          placeholder="Enter your name"
          class="bg-[#111112] border border-stone-850 focus:border-[#ab8c5c]/40 text-stone-100 text-xs md:text-sm px-5 py-3 rounded-lg focus:outline-none w-full sm:w-[220px] md:w-[260px] transition-all duration-300 placeholder-stone-500 font-light"
        />

        <input
          type="email"
          placeholder="Enter your email"
          class="bg-[#111112] border border-stone-850 focus:border-[#ab8c5c]/40 text-stone-100 text-xs md:text-sm px-5 py-3 rounded-lg focus:outline-none w-full sm:w-[220px] md:w-[260px] transition-all duration-300 placeholder-stone-500 font-light"
        />

        <button
          type="submit"
          class="bg-[#ab8c5c] hover:bg-[#bfa77e] text-stone-950 font-sans tracking-widest text-[11px] md:text-xs font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 uppercase shrink-0"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  </section>
</template>
