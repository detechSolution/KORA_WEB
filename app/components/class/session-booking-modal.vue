<script setup lang="ts">
import type { PropType } from "vue";
import type { Session } from "~/types/session";
import { computed, reactive, ref } from "vue";

import { useRouter } from "vue-router";
import * as z from "zod";

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

const currentStep = ref(0);
const steps = [{ label: "Attendees" }, { label: "Overview" }];

const formRef = ref<InstanceType<typeof UForm> | null>(null);
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

const schema = computed(() => [
  z.object({
    currentUser: z.object({
      fullName: z.string().min(1, "Full name is required"),
      phone: z.string().optional(),
      email: z.string().email("Invalid email").optional(),
    }),
  }),
]);

const pricing = computed(() => {
  return calculatePrice({
    price: props.session.price,
    guests: 1,
    discount: activeDiscount.value,
  });
});

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

async function validateCurrentStep(): Promise<boolean> {
  if (currentStep.value >= schema.value.length)
    return true;
  try {
    await formRef.value?.validate();
    return true;
  }
  catch {
    return false;
  }
}

function nextStep() {
  void validateCurrentStep().then((isValid) => {
    if (isValid && currentStep.value < steps.length - 1) {
      currentStep.value += 1;
    }
  });
}

const bookingItem = computed(() => ({
  referenceId: props.session.id,
  title: props.session.name,
  type: props.session.type,
  unitPrice: pricing.value.unitPrice,
  unitPriceAfterDiscount: pricing.value.unitPriceAfterDiscount,
  bookingDate: props.session.sessionDate,
  bookingTime: props.session.startTime,
  location: props.session.venue,
  image: props.session.bannerUrl,
  visitors: [],
  subtotal: pricing.value.subtotal,
  // membershipDiscount: MEMBERSHIP_DISCOUNT,
  // promoDiscount: PROMO_DISCOUNT,
  discountAmount: pricing.value.discountAmount,
  finalPrice: pricing.value.finalPrice,
  itemType: "session",
}));

function addToCart() {
  cartStore.addToCart(bookingItem.value);
  success({ message: "Item added to cart successfully!" });
  close();
}

function proceedToCheckout() {
  cartStore.addToCart(bookingItem.value);
  router.push("/checkout");
  close();
}

function close() {
  currentStep.value = 0;
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
      <!-- Form and Stepper -->
      <div class="flex flex-col">
        <!-- Stepper -->
        <base-form-stepper
          :steps="steps"
          :current-step="currentStep"
          orientation="horizontal"
          class="mb-8 max-w-sm mx-auto"
          @select="goToStep"
        />

        <UForm
          ref="formRef"
          :schema="schema[currentStep]"
          :state="state"
        >
          <Transition name="fade" mode="out-in">
            <!-- STEP 1 -->
            <div
              v-if="currentStep === 0"
              key="step-attendees"
              class="flex flex-col"
            >
              <div class="mb-8">
                <h2 class="text-3xl font-serif text-foreground mb-3">
                  Your Details
                </h2>
                <p class="text-xs text-[#A08860]">
                  Please confirm your details for the booking.
                </p>
              </div>

              <div class="w-full h-px bg-border/40 mb-8" />

              <div class="flex flex-col gap-6 mb-8">
                <base-input
                  v-model="state.currentUser.fullName"
                  name="currentUser.fullName"
                  label="FULL NAME *"
                  type="text"
                  class="bg-white dark:bg-transparent"
                  disabled
                />

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <base-input
                    v-model="state.currentUser.phone"
                    name="currentUser.phone"
                    label="PHONE NUMBER"
                    type="text"
                    class="bg-white dark:bg-transparent"
                  />

                  <base-input
                    v-model="state.currentUser.email"
                    name="currentUser.email"
                    label="EMAIL ADDRESS"
                    type="email"
                    class="bg-white dark:bg-transparent"
                    disabled
                  />
                </div>
              </div>

              <div class="flex justify-end items-center mt-4">
                <base-button
                  class="uppercase text-[11px] tracking-widest font-bold px-10 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white"
                  @click="nextStep"
                >
                  Next
                </base-button>
              </div>
            </div>

            <!-- STEP 2 -->
            <div
              v-else
              key="step-overview"
              class="flex flex-col"
            >
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
                <h4
                  class="font-serif text-lg font-medium text-foreground mb-6"
                >
                  Overview
                </h4>

                <div class="flex flex-col gap-4 mb-6">
                  <div
                    class="flex justify-between items-center text-sm text-foreground"
                  >
                    <span>
                      {{ session.name }} (Rs. {{ session.price }} × 1)
                    </span>

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

                <div
                  class="flex justify-between items-center border-t border-border/40 pt-4 text-foreground text-xl md:text-2xl"
                >
                  <span class="font-serif font-bold"> Total </span>

                  <span class="font-serif font-bold">
                    Rs. {{ formatPrice(pricing.finalPrice) }}
                  </span>
                </div>

                <div class="border-b border-border/40 pb-6 mb-8" />
              </div>

              <div
                class="flex flex-col sm:flex-row justify-between gap-2 mt-auto"
              >
                <base-button variant="outline" @click="previousStep">
                  Back
                </base-button>

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
          </Transition>
        </UForm>
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
