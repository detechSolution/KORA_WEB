<template>
  <div
    class="bg-background dark:bg-secondary-900 text-foreground font-sans select-none"
  >
    <!-- Block 01: Metamorphosis Crafted For You -->
    <section
      class="w-full lg:h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden"
    >
      <!-- Left Column: Large Image -->
      <div class="w-full h-[50vh] lg:h-full relative overflow-hidden group">
        <img
          :src="IMAGES.OFFERINGS_MEMBERSHIP"
          alt="Metamorphosis crafted for you"
          class="w-full h-full object-cover transition-transform duration-[6000ms] ease-out-quad group-hover:scale-105"
        />
        <div
          class="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none"
        ></div>
      </div>

      <!-- Right Column: Text content -->
      <div
        class="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 lg:py-0"
      >
        <span
          class="font-serif text-muted-foreground/30 text-7xl md:text-8xl select-none leading-none mb-2"
          >01</span
        >
        <h3
          class="font-serif text-3xl md:text-4xl text-foreground font-normal leading-tight tracking-wide mb-6"
        >
          Metamorphosis Crafted For You
        </h3>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-8"
        >
          Each membership at Kora is thoughtfully designed to support your
          ongoing wellness journey. Whether you're building consistency,
          deepening recovery, or prioritizing stillness, our memberships provide
          flexible access with purpose and care. From invigorating routines to
          restorative rituals, every experience helps you stay connected to your
          body, clear your mind, and maintain a sense of balance.
        </p>
        <div>
          <base-button>View Memberships</base-button>
        </div>
      </div>
    </section>

    <!-- Block 02: Sessions Designed For You -->
    <section
      class="w-full lg:h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden"
    >
      <!-- Left Column: Text content -->
      <div
        class="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 lg:py-0 order-2 lg:order-1"
      >
        <span
          class="font-serif text-muted-foreground/30 text-7xl md:text-8xl select-none leading-none mb-2"
          >02</span
        >
        <h3
          class="font-serif text-3xl md:text-4xl text-foreground font-normal leading-tight tracking-wide mb-6"
        >
          Sessions Designed For You
        </h3>
        <p
          class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-8"
        >
          Each session at Kora is thoughtfully crafted to support your
          individual journey. Whether you're seeking movement, recovery, or
          stillness, our sessions are guided with intention and care. From
          energizing practices to restorative experiences, every moment is
          designed to help you reconnect with your body, reset your mind, and
          leave feeling balanced.
        </p>
        <div>
          <base-button>View All Sessions</base-button>
        </div>
      </div>

      <!-- Right Column: Large Image -->
      <div
        class="w-full h-[50vh] lg:h-full relative overflow-hidden group order-1 lg:order-2"
      >
        <img
          :src="IMAGES.OFFERINGS_SESSIONS"
          alt="Sessions designed for you"
          class="w-full h-full object-cover transition-transform duration-[6000ms] ease-out-quad group-hover:scale-105"
        />
        <div
          class="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 pointer-events-none"
        ></div>
      </div>
    </section>

    <!-- Centered CTA: Access a Different Way of Living, Rooted in Clarity -->
    <section
      class="relative py-28 md:py-36 px-6 overflow-hidden bg-background dark:bg-secondary-900 text-center flex flex-col items-center justify-center"
    >
      <!-- Top-Right Foliage Decal -->
      <div
        class="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 pointer-events-none translate-x-12 -translate-y-12 select-none z-10"
      >
        <img
          :src="IMAGES.LEAF"
          alt="The Kora Experience"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Bottom-Left Foliage Decal -->
      <div
        class="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 pointer-events-none select-none z-10"
      >
        <img
          :src="IMAGES.LEAF"
          alt="leaf"
          class="w-full h-full object-cover scale-x-[-1] scale-y-[-1]"
        />
      </div>

      <div
        class="max-w-[1400px] flex flex-col items-center justify-center gap-12"
      >
        <div class="relative z-20 mx-auto flex flex-col items-center">
          <h2
            class="font-serif text-3xl md:text-5xl text-foreground font-normal leading-tight tracking-wide mb-6"
          >
            Access a Different Way of Living,<br />
            <span class="text-primary italic">Rooted in Clarity</span>
          </h2>

          <p
            class="text-muted-foreground font-light text-sm md:text-base leading-relaxed mb-10"
          >
            Step beyond routine and enter a space designed for deep alignment.
            Every session and retreat is a step toward clarity, presence, and
            lasting change.
          </p>

          <!-- CTA Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <base-button>BEGIN YOUR JOURNEY</base-button>
            <base-button variant="outline"> EXPLORE SESSIONS </base-button>
          </div>
        </div>

        <!-- Newletter -->
        <HomeNewsletter />
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
