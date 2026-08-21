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
    if (checkoutCode.value) {
      await checkoutStore.verifyPayment(checkoutCode.value);
    }
    else {
      checkoutStore.paymentStatus = "paid";
      checkoutStore.loading = false;
    }

    if (checkoutStore.paymentStatus === "paid") {
      const pendingIds = JSON.parse(
        sessionStorage.getItem("pendingPaymentItemIds") || "[]",
      );
      if (pendingIds.length > 0) {
        pendingIds.forEach((cartId: string) => cartStore.removeItem(cartId));
        sessionStorage.removeItem("pendingPaymentItemIds");
      }
      else {
        if (cartStore.cartItems.length > 0) {
          cartStore.cartItems = [];
        }
      }

      if (cartStore.cartItems.length === 0) {
        cartStore.removePromoCode();
      }
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
    <div
      v-if="checkoutStore.loading"
      class="flex flex-col items-center justify-center gap-6"
    >
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
        <base-button to="/session" class="w-full text-[11px]">
          BOOK MORE SERVICES
        </base-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional custom animations */
</style>
