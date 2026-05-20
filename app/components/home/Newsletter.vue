<template>
  <section
    class="w-full bg-[#EDEAE7] dark:bg-[#212121] relative py-4 md:py-4 px-6 md:px-6 lg:px-6"
  >
    <div
      class="mx-auto relative z-20 flex flex-col lg:flex-row gap-6 lg:gap-12 items-center justify-between"
    >
      <!-- Left side: Serif title -->
      <div class="flex items-center gap-3">
        <h4
          class="font-serif text-lg md:text-xl text-foreground tracking-wide font-normal"
        >
          Newsletter Sign Up
        </h4>
      </div>

      <!-- Right side: Sleek, horizontal form -->
      <form
        @submit.prevent
        class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center"
      >
        <base-input
          type="text"
          name="name"
          placeholder="Enter your name"
          class="w-full sm:w-[220px] md:w-[260px] bg-white dark:bg-transparent"
          required
        />

        <base-input
          type="email"
          name="email"
          placeholder="Enter your email"
          class="w-full sm:w-[220px] md:w-[260px] bg-white dark:bg-transparent"
        />

        <base-button type="submit"> SUBSCRIBE </base-button>
      </form>
    </div>
  </section>
</template>
