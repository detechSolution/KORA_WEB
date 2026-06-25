<script setup lang="ts">
import type { PropType } from "vue";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "~/composables/use-notification";
import { useCartStore } from "~/stores/cart";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  membership: {
    type: Object as PropType<any>,
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

const router = useRouter();
const cartStore = useCartStore();
const { success } = useNotification();

const membershipItem = computed(() => ({
  referenceId: props.membership.selectedOption.id,
  membershipPlanId: props.membership.selectedOption.membershipPlanId,
  title: props.membership.name,
  frequency: props.membership.selectedOption.frequency,
  price: props.membership.selectedOption.price,
  finalPrice: props.membership.selectedOption.price,
  itemType: "membership",
  memberBenefit: props.membership.selectedOption.memberBenefit,
  bookingFor: "self",
}));

function close() {
  emit("close");
}

function addToCart() {
  cartStore.addToCart(membershipItem.value);
  success({ message: "Item added to cart successfully!" });
  close();
}

function proceedToCheckout() {
  cartStore.addToCart(membershipItem.value);
  close();
  router.push("/checkout");
}
</script>

<template>
  <base-modal
    title=""
    :open="isOpen"
    :modal-width="700"
    modal-max-height="90vh"
    :dismissible="true"
    class="dark:bg-nirvana-mist"
    @close="close"
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
          <div
            class="flex justify-between items-center text-sm text-foreground"
          >
            <span>{{ membership.name }} - {{ period }}</span>
            <span>{{ price }}</span>
          </div>
        </div>

        <div
          class="flex justify-between items-center border-t border-border/40 pt-4 text-foreground"
        >
          <span class="font-serif font-bold">Total</span>
          <span class="font-serif font-bold">{{ price }}</span>
        </div>
        <div class="border-b border-border/40 pb-6 mb-8" />
      </div>

      <div class="flex flex-col sm:flex-row justify-end gap-4 mt-auto">
        <base-button
          class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none bg-[#1C1C1C] hover:bg-[#111111] dark:bg-black dark:hover:bg-[#111] text-white"
          @click="addToCart"
        >
          ADD TO CART
        </base-button>

        <base-button
          class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white"
          @click="proceedToCheckout"
        >
          PROCEED TO CHECKOUT
        </base-button>
      </div>
    </div>
  </base-modal>
</template>
