<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCartStore } from "~/stores/cart";
import { useCheckoutStore } from "~/stores/checkout";
// import { formatPrice } from "~/utils/format";

const route = useRoute();
const cartStore = useCartStore();
const checkoutStore = useCheckoutStore();

const checkoutCode = computed(() => {
  return String(route.query.checkout_code || "");
});

const sessionId = computed(() => String(route.query.session_id || ""));

onMounted(async () => {
  try {
    if (cartStore.cartItems.length > 0) {
      cartStore.cartItems = [];
      cartStore.removePromoCode();
    }

    if (checkoutCode.value) {
      await checkoutStore.verifyPayment(checkoutCode.value);
    }
    else {
      checkoutStore.paymentStatus = "paid";
      checkoutStore.loading = false;
    }
  }
  catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <div
    class="bg-background dark:bg-secondary-900 flex flex-col items-center justify-center px-4 pb-14 pt-6 font-sans"
  >
    <div v-if="checkoutStore.loading" class="flex flex-col items-center justify-center gap-6">
      <div class="relative w-16 h-16 flex items-center justify-center">
        <div class="absolute inset-0 border-2 border-border rounded-full" />
        <div
          class="absolute inset-0 border-2 border-[#B59A6D] rounded-full border-t-transparent animate-spin"
        />
        <UIcon name="i-lucide-check" class="w-6 h-6 text-[#B59A6D]/50" />
      </div>
      <p
        class="text-muted-foreground font-serif tracking-wide text-lg animate-pulse"
      >
        Confirming your payment...
      </p>
    </div>

    <div
      v-else-if="checkoutStore.paymentStatus === 'paid'"
      class="max-w-2xl w-full bg-card border border-border p-10 md:p-16 flex flex-col items-center text-center gap-8 relative overflow-hidden rounded-sm shadow-sm"
    >
      <!-- Decorative background glow -->
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-40 bg-gradient-to-b from-[#B59A6D]/10 to-transparent blur-3xl rounded-[100%] pointer-events-none"
      />

      <div
        class="w-24 h-24 bg-card rounded-full flex items-center justify-center mb-2 z-10 border border-[#B59A6D]/30 shadow-[0_0_30px_rgba(181,154,109,0.15)] relative"
      >
        <div
          class="absolute inset-0 rounded-full border border-[#B59A6D] animate-[ping_2s_ease-out_infinite] opacity-20"
        />
        <UIcon name="i-lucide-check" class="w-10 h-10 text-[#B59A6D]" />
      </div>

      <div class="flex flex-col gap-5 z-10">
        <h1
          class="text-3xl md:text-4xl font-serif text-foreground font-medium uppercase tracking-wide"
        >
          Payment Successful
        </h1>

        <div class="h-[1px] w-12 bg-[#B59A6D]/50 mx-auto my-1" />

        <p
          class="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto"
        >
          Your payment has been successfully processed and your order is now
          confirmed.
        </p>

        <p
          class="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto"
        >
          You can view your booked services anytime from your profile. A payment
          confirmation receipt will also be sent to your email shortly.
        </p>
      </div>

      <!-- <div
        v-if="checkoutStore.paymentDetails && checkoutStore.paymentDetails.items && checkoutStore.paymentDetails.items.length > 0"
        class="w-full text-left mt-6 mb-2 border border-[#B59A6D]/20 bg-card p-6 shadow-sm z-10"
      >
        <h3 class="text-[10px] md:text-xs uppercase tracking-widest text-[#B59A6D] font-bold mb-4">
          Order Summary
        </h3>
        <div
          v-for="item in checkoutStore.paymentDetails.items"
          :key="item.id"
          class="flex justify-between items-start text-sm py-3 border-b border-border/40 last:border-0"
        >
          <div class="flex flex-col gap-1 pr-4">
            <span class="font-serif text-foreground text-base">{{ item.title }}</span>
            <span v-if="item.bookingDate" class="text-xs text-muted-foreground">
              {{ item.bookingDate }} <span v-if="item.bookingTime">at {{ item.bookingTime }}</span>
            </span>
            <span v-if="item.type" class="text-[10px] uppercase text-[#B59A6D]">{{ item.type }}</span>
          </div>
          <span class="font-medium font-serif mt-1 whitespace-nowrap">Rs. {{ formatPrice(item.totalAmount) }}</span>
        </div>

        <div class="flex justify-between items-center pt-4 mt-2 border-t border-[#B59A6D]/30">
          <span class="text-xs font-bold uppercase tracking-widest text-foreground">Total Paid</span>
          <span class="text-lg font-serif font-bold text-[#B59A6D]">Rs. {{ formatPrice(checkoutStore.paymentDetails.summary?.total || 0) }}</span>
        </div>
      </div> -->

      <div
        v-if="checkoutCode || sessionId"
        class="w-full flex justify-center items-center gap-6 py-5 border-y border-border/40 mt-4 mb-2 z-10 text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-semibold"
      >
        <div v-if="checkoutCode" class="flex flex-col items-center gap-1.5">
          <span class="text-foreground/40">REFERENCE NUMBER</span>
          <span class="text-[#B59A6D] font-bold">{{ checkoutCode }}</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 w-full z-10 mt-6">
        <base-button
          to="/profile"
          variant="outline"
          class="w-full text-[11px]"
        >
          GO TO PROFILE
        </base-button>
        <base-button
          to="/session"
          class="w-full text-[11px]"
        >
          BOOK MORE SERVICES
        </base-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional custom animations */
</style>
