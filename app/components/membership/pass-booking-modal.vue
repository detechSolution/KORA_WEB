<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import type { PropType } from "vue";
import type { Pass } from "~/data/membership";
import { getLocalTimeZone, today } from "@internationalized/date";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import z from "zod";
import { useNotification } from "~/composables/use-notification";
import { useCartStore } from "~/stores/cart";
import { formatDate } from "~/utils/format";
import { calculatePrice } from "~/utils/helper";

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
  pass: {
    type: Object as PropType<Pass>,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const router = useRouter();
const cartStore = useCartStore();
const { success } = useNotification();

const userDetail = JSON.parse(localStorage.getItem("user_data") || "{}");
const state = reactive({
  currentUser: {
    fullName: userDetail?.fullName || userDetail?.name || "You",
    phone: userDetail?.phone || "",
    email: userDetail?.email || "",
  },
  guests: [] as Guest[],
  date: null as any,
});

const formRef = ref<InstanceType<typeof UForm> | null>(null);
const currentStep = ref(0);

const pricing = computed(() =>
  calculatePrice({
    price: props.pass.price,
    guests: state.guests.length + 1,
  }),
);

const passItem = computed(() => ({
  referenceId: props.pass.id,
  title: props.pass.name,
  price: props.pass.price,
  unitPrice: pricing.value.unitPrice,
  unitPriceAfterDiscount: pricing.value.unitPriceAfterDiscount,
  visitors: state.guests,
  currentUser: { ...state.currentUser },
  itemType: "pass",
  finalPrice: pricing.value.finalPrice,
  memberBenefit: props.pass.discountTag,
  bookingDate: formatDate(state.date, "YYYY-MM-DD"),
}));

const schema = [
  // Step 0 — Date
  z.object({
    date: z.any().refine(v => !!v, "Please select a date"),
  }),
];

const steps = [
  {
    label: "Date",
  },
  {
    label: "Overview",
  },
];

function isDateUnavailable(date: DateValue) {
  return date.compare(today(getLocalTimeZone())) < 0;
}

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
  try {
    await formRef.value?.validate();
    return true;
  }
  catch {
    return false;
  }
}

function close() {
  currentStep.value = 0;
  resetGuests();
  emit("close");
}

function resetGuests() {
  state.guests = [];
}

// function removeGuest(index: number) {
//   if (state.guests.length > 0) {
//     state.guests.splice(index, 1);
//   }
// }

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value -= 1;
  }
}

function nextStep() {
  void validateCurrentStep().then((isValid) => {
    if (isValid && currentStep.value < steps.length - 1) {
      currentStep.value += 1;
    }
  });
}

function addToCart() {
  cartStore.addToCart(passItem.value);
  success({ message: "Item added to cart successfully!" });
}

function proceedToCheckout() {
  cartStore.addToCart(passItem.value);
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
    <div class="p-4 md:p-6">
      <!-- Step Indicators -->
      <base-form-stepper
        :steps="steps"
        :current-step="currentStep"
        orientation="horizontal"
        class="mb-8"
        @select="goToStep"
      />

      <UForm
        ref="formRef"
        :schema="schema[currentStep]"
        :state="state"
      >
        <Transition name="fade" mode="out-in">
          <!-- Step 1: Date -->
          <div
            v-if="currentStep === 0"
            key="step2"
            class="flex flex-col gap-8"
          >
            <div>
              <h2 class="text-3xl font-serif text-foreground mb-3">
                Choose Your Date
              </h2>
              <p class="text-xs text-[#A08860]">
                Access to this pass begins on the date you select.
              </p>
            </div>

            <UFormField name="date" class="flex flex-col gap-4 pb-6">
              <p class="text-primary-700 font-medium text-sm capitalize">
                Select Date
              </p>
              <UCalendar
                v-model="state.date"
                :is-date-unavailable="isDateUnavailable"
                :ui="{
                  headCell: 'text-xs font-normal',
                  gridBody: 'grid gap-2 sm:gap-4',
                  cellTrigger:
                    'w-full rounded-none flex flex-col h-8 w-8 p-1 sm:h-12 sm:w-12 sm:p-2 border border-border',
                }"
              />
            </UFormField>

            <div class="flex flex-col sm:flex-row justify-end gap-4 mt-auto">
              <base-button
                class="uppercase text-[11px] tracking-widest font-bold px-10 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white"
                @click="nextStep"
              >
                Next
              </base-button>
            </div>
          </div>

          <!-- Step 2: Overview -->
          <div
            v-else
            key="step3"
            class="flex flex-col"
          >
            <div class="mb-8">
              <h2 class="text-3xl font-serif text-foreground mb-3">
                Review Your Booking
              </h2>
              <p class="text-xs text-[#A08860]">
                Please check your pass booking details before confirming
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
                    {{ pass.name }} (Rs. {{ pass.price }} ×
                    {{ state.guests.length + 1 }})
                  </span>
                  <span>Rs. {{ formatPrice(pricing.subtotal) }}</span>
                </div>
                <div
                  v-if="pass.discountTag"
                  class="flex justify-between items-center text-sm text-muted-foreground"
                >
                  <span>Discount</span>
                  <span>{{ pass.discountTag }}</span>
                </div>
              </div>

              <div
                class="flex justify-between items-center border-t border-border/40 pt-4 text-foreground text-2xl"
              >
                <span class="font-serif font-bold">Total</span>
                <span class="font-serif font-bold">
                  Rs. {{ formatPrice(pricing.finalPrice) }}</span>
              </div>
              <div class="border-b border-border/40 pb-6 mb-8" />
            </div>

            <div
              class="flex flex-col sm:flex-row justify-between gap-4 mt-auto"
            >
              <base-button
                class=""
                variant="outline"
                @click="previousStep"
              >
                Back
              </base-button>
              <div class="flex flex-col sm:flex-row gap-2">
                <base-button
                  class="bg-black dark:bg-black hover:bg-black/70"
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
          </div>
        </Transition>
      </UForm>
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
