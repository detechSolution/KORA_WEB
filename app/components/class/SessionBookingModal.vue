<script setup lang="ts">
import { computed, ref } from "vue";
import type { PropType } from "vue";
import { useRouter } from "vue-router";

import type { Session } from "~/types/session";

import { useCartStore } from "~/stores/cart";

import { formatTime } from "~/utils/format";
import { calculatePrice } from "~/utils/helper";
import { useNotification } from "~/composables/use-notification";

type Guest = {
  fullName: string;
  phone: string;
  email: string;
};

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

const currentStep = ref(0);

const steps = [{ label: "Attendees" }, { label: "Overview" }];

const userDetail = JSON.parse(localStorage.getItem("user_data") || "{}");

const createGuest = (): Guest => ({
  fullName: "",
  phone: "",
  email: "",
});

const guests = ref<Guest[]>([
  {
    fullName: userDetail?.name || "",
    phone: userDetail?.phone || "",
    email: userDetail?.email || "",
  },
]);

const resetGuests = () => {
  guests.value = [
    {
      fullName: userDetail?.name || "",
      phone: userDetail?.phone || "",
      email: userDetail?.email || "",
    },
  ];
};
const addGuest = () => {
  guests.value.push(createGuest());
};

const removeGuest = (index: number) => {
  if (guests.value.length <= 1) return;

  guests.value.splice(index, 1);
};

const MEMBERSHIP_DISCOUNT = userDetail?.membership?.option?.memberBenefit || 0;
const PROMO_DISCOUNT = 0;

const pricing = computed(() =>
  calculatePrice({
    price: props.session.price,
    guests: guests.value.length,
    discount: MEMBERSHIP_DISCOUNT,
  }),
);
console.log("🚀 ~ pricing:", pricing.value)

function goToStep(step: number) {
  if (step > currentStep.value) {
    void validateCurrentStep().then((isValid) => {
      if (isValid) {
        currentStep.value = step;
      }
    });

    return;
  }

  currentStep.value = step;
}

async function validateCurrentStep() {
  return true;
}

const nextStep = () => {
  currentStep.value = 1;
};

const previousStep = () => {
  currentStep.value = 0;
};

const bookingItem = computed(() => ({
  id: props.session.id,
  title: props.session.name,
  type: props.session.type,
  price: props.session.price,
  date: props.session.sessionDate,
  time: `${formatTime(props.session.startTime)} - ${formatTime(props.session.endTime)}`,
  location: props.session.venue,
  image: props.session.bannerUrl,
  guests: guests.value,
  subtotal: pricing.value.subtotal,
  membershipDiscount: MEMBERSHIP_DISCOUNT,
  promoDiscount: PROMO_DISCOUNT,
  discountAmount: pricing.value.discountAmount,
  finalPrice: pricing.value.finalPrice,
  itemType: "session"
}));

const addToCart = () => {
  cartStore.addToCart(bookingItem.value);
  success({ message: "Item added to cart successfully!" });
};

const proceedToCheckout = () => {
  cartStore.addToCart(bookingItem.value);
  router.push("/checkout");
  close();
};

const close = () => {
  currentStep.value = 0;
  resetGuests();
  emit("close");
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
    <div class="p-4 md:p-6">
      <!-- Stepper -->
      <base-form-stepper
        :steps="steps"
        :current-step="currentStep"
        orientation="horizontal"
        class="mb-8 max-w-sm mx-auto"
        @select="goToStep"
      />

      <Transition name="fade" mode="out-in">
        <!-- STEP 1 -->
        <div
          v-if="currentStep === 0"
          key="step-attendees"
          class="flex flex-col"
        >
          <div class="mb-8">
            <h2 class="text-3xl font-serif text-foreground mb-3">
              Who's Joining?
            </h2>

            <p class="text-xs text-[#A08860]">
              Add any additional guests joining the session, or simply click
              next to continue.
            </p>
          </div>

          <div class="w-full h-px bg-border/40 mb-8"></div>

          <div class="flex flex-col gap-6 mb-8">
            <div
              v-for="(guest, index) in guests"
              :key="index"
              class="relative flex flex-col gap-6"
            >
              <div v-if="index > 0" class="w-full h-px bg-border/40"></div>

              <div class="flex items-center justify-between">
                <h4 v-if="index > 0" class="text-sm font-serif text-[#A08860]">
                  Guest {{ index + 1 }}
                </h4>

                <button
                  v-if="guests.length > 1"
                  @click="removeGuest(index)"
                  class="absolute top-0 right-0 flex items-center gap-1 text-xs text-red-800 hover:text-red-600 transition-colors hover:cursor-pointer"
                >
                  <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5" />

                  Remove
                </button>
              </div>

              <base-input
                v-model="guest.fullName"
                :name="`fullName_${index}`"
                label="FULL NAME *"
                type="text"
                class="bg-white dark:bg-transparent"
              />

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <base-input
                  v-model="guest.phone"
                  :name="`phone_${index}`"
                  label="PHONE NUMBER"
                  type="text"
                  class="bg-white dark:bg-transparent"
                />

                <base-input
                  v-model="guest.email"
                  :name="`email_${index}`"
                  label="EMAIL ADDRESS *"
                  type="email"
                  class="bg-white dark:bg-transparent"
                />
              </div>
            </div>

            <base-button
              @click="addGuest"
              variant="outline"
              class="w-full border-[#A08860] text-[#A08860] hover:bg-[#A08860]/10 uppercase text-[11px] tracking-widest font-bold h-12 mt-4"
            >
              ADD GUEST +
            </base-button>
          </div>

          <div class="flex justify-end">
            <base-button
              @click="nextStep"
              class="uppercase text-[11px] tracking-widest font-bold px-10 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white"
            >
              Next
            </base-button>
          </div>
        </div>

        <!-- STEP 2 -->
        <div v-else key="step-overview" class="flex flex-col">
          <div class="mb-8">
            <h2 class="text-3xl font-serif text-foreground mb-3">
              Review Your Booking
            </h2>

            <p class="text-xs text-[#A08860]">
              Please check your session booking details before confirming
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
                <span>
                  {{ session.name }} (Rs. {{ session.price }} × {{ guests.length }})
                </span>

                <span> Rs. {{ formatPrice(pricing.subtotal) }} </span>
              </div>

              <div
                class="flex justify-between items-center text-sm text-muted-foreground"
              >
                <span>Membership Discount ({{ MEMBERSHIP_DISCOUNT }}%)</span>

                <span> - Rs. {{ formatPrice(pricing.discountAmount) }} </span>
              </div>
            </div>

            <div
              class="flex justify-between items-center border-t border-border/40 pt-4 text-foreground"
            >
              <span class="font-serif font-bold"> Total </span>

              <span class="font-serif font-bold">
                Rs. {{ formatPrice(pricing.finalPrice) }}
              </span>
            </div>

            <div class="border-b border-border/40 pb-6 mb-8"></div>
          </div>

          <div class="flex flex-col sm:flex-row justify-between gap-4 mt-auto">
            <base-button @click="previousStep" variant="outline">
              Back
            </base-button>

            <div class="flex flex-col sm:flex-row gap-2">
              <base-button
                @click="addToCart"
                class="bg-black dark:bg-black hover:bg-black/70"
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
        </div>
      </Transition>
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
