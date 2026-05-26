<script setup lang="ts">
import type { PropType } from "vue";
import type { MembershipTier } from "~/data/membership";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  membership: {
    type: Object as PropType<MembershipTier>,
    required: true,
  },
  period: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};

const addToCart = () => {
  close();
  // logic to add to cart
};

const proceedToCheckout = () => {
  close();
  navigateTo("/checkout");
};

// Assuming 10% discount for Quarterly and 20% for Yearly based on the membership page logic
// This is just a mock for UI to show discount line if applicable
const getDiscount = () => {
  if (props.period === "QUARTERLY") return "10%";
  if (props.period === "YEARLY") return "20%";
  return null;
};
</script>

<template>
  <base-modal
    title=""
    :open="isOpen"
    @close="close"
    :modal-width="700"
    modal-max-height="90vh"
    :dismissible="true"
    class="dark:bg-nirvana-mist"
  >
    <div class="p-6 md:p-12">
      <div class="mb-8 mt-4">
        <h2 class="text-3xl font-serif text-foreground mb-2">
          Purchase Membership
        </h2>
        <p class="text-xs text-[#A08860]">
          Begin your metamorphosis
        </p>
      </div>

      <h3
        class="text-[10px] font-bold tracking-widest uppercase text-[#A08860] mb-4"
      >
        BOOKING OVERVIEW
      </h3>

      <div class="border-t border-border/40 pt-6">
        <h4 class="font-serif text-lg font-medium text-foreground mb-6">
          Overview
        </h4>

        <div class="flex flex-col gap-4 mb-6">
          <div class="flex justify-between items-center text-sm text-foreground">
            <span>{{ membership.name }} - {{ period }}</span>
            <span>{{ price }}</span>
          </div>
          <div v-if="getDiscount()" class="flex justify-between items-center text-sm text-muted-foreground">
            <span>Discount</span>
            <span>{{ getDiscount() }}</span>
          </div>
        </div>

        <div class="flex justify-between items-center border-t border-border/40 pt-4 text-foreground">
          <span class="font-serif font-bold">Total</span>
          <span class="font-serif font-bold">{{ price }}</span>
        </div>
        <div class="border-b border-border/40 pb-6 mb-8"></div>
      </div>

      <div class="flex flex-col sm:flex-row justify-end gap-4 mt-auto">
        <base-button
          @click="addToCart"
          class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none bg-[#1C1C1C] hover:bg-[#111111] dark:bg-black dark:hover:bg-[#111] text-white"
        >
          ADD TO CART
        </base-button>

        <base-button
          @click="proceedToCheckout"
          class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white"
        >
          PROCEED TO CHECKOUT
        </base-button>
      </div>
    </div>
  </base-modal>
</template>
