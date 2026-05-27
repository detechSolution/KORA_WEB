<script setup lang="ts">
import { IMAGES } from "~/utils/images";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Kora | Create Account",
  description: "Begin your ritual of becoming. Join the sanctuary.",
});
</script>

<template>
  <div class="min-h-screen w-full flex bg-[#151515] text-white overflow-hidden">
    <!-- Left Panel: Form -->
    <div class="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 relative">
      <!-- Decorative Leaf (Top Right of Left Panel) -->
      <div
        class="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-20 -translate-y-10 translate-x-10"
      >
        <img
          :src="IMAGES.LEAF"
          class="w-full h-full object-cover rotate-12"
          alt=""
        />
      </div>

      <!-- Form Container -->
      <div class="w-full max-w-md mx-auto my-auto relative z-10">
        <!-- Logo -->
        <div class="mb-16 relative z-10">
          <NuxtLink to="/" class="flex items-center gap-3">
            <img
              :src="IMAGES.WHITE_LOGO"
              alt="Kora Logo"
              class="w-44 h-w-28"
              onerror="this.style.display = 'none'"
            />
          </NuxtLink>
        </div>

        <h1 class="font-serif text-4xl mb-3 text-white">Create Account</h1>
        <p class="text-xs text-secondary-400 mb-10">
          Begin your ritual of becoming. Join the sanctuary.
        </p>

        <base-button
          class="w-full h-11 bg-[#252525] dark:bg-[#252525] border border-white/5 hover:bg-[#2A2A2A] font-medium text-[11px] mb-5"
        >
          <img :src="IMAGES.GOOGLE_LOGO" alt="Google" class="w-4 h-4" />
          Log in with Google
        </base-button>

        <base-section-label label="Or" align="center" class="mb-5" />

        <form @submit.prevent class="flex flex-col gap-5">
          <base-input
            name="fullName"
            label="FULL NAME *"
            placeholder="Your full name"
            type="text"
            leading-icon="i-lucide-user"
            class="bg-transparent"
          />
          <base-input
            name="email"
            label="EMAIL ADDRESS *"
            placeholder="Your email address"
            type="email"
            leading-icon="i-lucide-mail"
            class="bg-transparent"
          />
          <base-input
            name="phone"
            label="PHONE NUMBER (optional)"
            placeholder="Your phone number"
            type="tel"
            leading-icon="i-lucide-phone"
            class="bg-transparent"
          />
          <base-input
            name="password"
            label="PASSWORD *"
            placeholder="Create a password"
            type="password"
            leading-icon="i-lucide-lock"
            class="bg-transparent"
          />

          <base-button
            class="w-full"
          >
            REGISTER
          </base-button>
        </form>

        <p class="text-center text-xs text-secondary-400 mt-5">
          Already have an account?
          <NuxtLink
            to="/login"
            class="text-[#B59A6D] hover:text-[#C5AA7D] underline decoration-[#B59A6D]/30 underline-offset-4"
            >Log In</NuxtLink
          >
        </p>
      </div>

      <!-- Footer spacer -->
      <div class="mt-auto relative z-10"></div>
    </div>

    <!-- Right Panel: Image -->
    <div class="hidden lg:block lg:w-1/2 relative h-screen">
      <img
        :src="IMAGES.LOGIN"
        alt="Meditation"
        class="w-full h-full object-cover"
      />
    </div>
  </div>
</template>
