<script setup lang="ts">
import type { PropType } from "vue";
import type { Session } from "~/types/session";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "~/composables/use-notification";
import { useCartStore } from "~/stores/cart";
import { calculatePrice } from "~/utils/helper";
import { getMembershipBenefits, getPassesBenefits } from "~/utils/membership";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  session: {
    type: Object as PropType<Session>,
    required: true,
  },
});

const emit = defineEmits<{
  close: [];
}>();

const router = useRouter();
const cartStore = useCartStore();
const { success } = useNotification();

const quantity = ref(1);

const userDetail = JSON.parse(localStorage.getItem("user_data") || "{}");
const state = reactive({
  currentUser: {
    fullName: userDetail?.fullName || userDetail?.name || "You",
    phone: userDetail?.phone || "",
    email: userDetail?.email || "",
  },
});

const benefits = getMembershipBenefits(userDetail);
const passesBenefits = getPassesBenefits(userDetail);
const MEMBERSHIP_DISCOUNT = benefits.member.class || 0;
const PASS_DISCOUNT = passesBenefits.class || 0;

const discountType = computed(() => {
  if (MEMBERSHIP_DISCOUNT > 0) {
    return "Membership Discount";
  }

  if (PASS_DISCOUNT > 0) {
    return "Pass Discount";
  }

  return null;
});

const activeDiscount = computed(() => {
  // Membership discount has the highest priority
  if (MEMBERSHIP_DISCOUNT > 0) {
    return MEMBERSHIP_DISCOUNT;
  }

  // Only apply pass discount for class sessions
  if (props.session.type === "class" && PASS_DISCOUNT > 0) {
    return PASS_DISCOUNT;
  }

  return 0;
});

const showDiscount = computed(() => activeDiscount.value > 0);

const singlePricing = computed(() => {
  return calculatePrice({
    price: props.session.price,
    quantity: 1,
    discount: activeDiscount.value,
  });
});

const pricing = computed(() => {
  return calculatePrice({
    price: props.session.price,
    quantity: quantity.value,
    discount: activeDiscount.value,
  });
});

const isEventOrWorkshop = computed(() => {
  return props.session.type === "event" || props.session.type === "workshop";
});

const maxQuantity = computed(() => {
  return Math.min(props.session.remainingSpots || 10, 10);
});

function incrementQuantity() {
  if (quantity.value < maxQuantity.value) {
    quantity.value++;
  }
}

function decrementQuantity() {
  if (quantity.value > 1) {
    quantity.value--;
  }
}

const bookingItem = computed(() => ({
  referenceId: props.session.id,
  title: props.session.name,
  type: props.session.type,
  unitPrice: singlePricing.value.unitPrice,
  unitPriceAfterDiscount: singlePricing.value.unitPriceAfterDiscount,
  bookingDate: props.session.sessionDate,
  bookingTime: props.session.startTime,
  location: props.session.venue,
  image: props.session.bannerUrl,
  visitors: [],
  currentUser: { ...state.currentUser },
  subtotal: singlePricing.value.subtotal,
  discountAmount: singlePricing.value.discountAmount,
  finalPrice: singlePricing.value.finalPrice,
  itemType: "session",
}));

function addToCart() {
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addToCart(bookingItem.value);
  }
  success({ message: "Item added to cart successfully!" });
  close();
}

function proceedToCheckout() {
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addToCart(bookingItem.value);
  }
  router.push("/checkout");
  close();
}

function close() {
  quantity.value = 1;
  emit("close");
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
    <div class="p-4 md:p-6">
      <div class="flex flex-col">
        <div class="mb-8">
          <h2 class="text-3xl font-serif text-foreground mb-3">
            Review Your Booking
          </h2>
          <p class="text-xs text-[#A08860]">
            Please check your session booking details before confirming
          </p>
        </div>

        <h3 class="text-[10px] font-bold tracking-widest uppercase text-[#A08860] mb-4">
          BOOKING OVERVIEW
        </h3>

        <div class="border-t border-border/40 pt-6">
          <h4 class="font-serif text-lg font-medium text-foreground mb-6">
            Overview
          </h4>

          <div class="flex flex-col gap-4 mb-6">
            <div class="flex justify-between items-center text-sm text-foreground">
              <span>
                {{ session.name }}
              </span>

              <div v-if="isEventOrWorkshop" class="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  class="w-7 h-7 flex items-center justify-center border border-border text-foreground hover:bg-border/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  :disabled="quantity <= 1"
                  @click="decrementQuantity"
                >
                  <UIcon name="i-lucide-minus" class="w-3.5 h-3.5" />
                </button>
                <span class="text-sm font-semibold text-foreground min-w-[1.5rem] text-center">{{ quantity }}</span>
                <button
                  type="button"
                  class="w-7 h-7 flex items-center justify-center border border-border text-foreground hover:bg-border/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  :disabled="quantity >= maxQuantity"
                  @click="incrementQuantity"
                >
                  <UIcon name="i-lucide-plus" class="w-3.5 h-3.5" />
                </button>
              </div>

              <span> Rs. {{ formatPrice(pricing.subtotal) }} </span>
            </div>
            <div
              v-if="showDiscount"
              class="flex justify-between text-sm font-normal text-secondary-500 dark:text-secondary-400"
            >
              <h2>{{ discountType }} ({{ activeDiscount }}%)</h2>
              <p>- Rs. {{ formatPrice(pricing.discountAmount) }}</p>
            </div>
          </div>

          <div class="flex justify-between items-center border-t border-border/40 pt-4 text-foreground text-xl md:text-2xl">
            <span class="font-serif font-bold"> Total </span>
            <span class="font-serif font-bold">
              Rs. {{ formatPrice(pricing.finalPrice) }}
            </span>
          </div>

          <div class="border-b border-border/40 pb-6 mb-8" />
        </div>

        <div class="flex flex-col sm:flex-row justify-end gap-2 mt-auto">
          <div class="flex flex-col sm:flex-row gap-2">
            <base-button
              class="bg-black dark:bg-black hover:bg-black/70"
              @click="addToCart"
            >
              ADD TO CART
            </base-button>

            <base-button @click="proceedToCheckout">
              PROCEED TO CHECKOUT
            </base-button>
          </div>
        </div>
      </div>
    </div>
  </base-modal>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
