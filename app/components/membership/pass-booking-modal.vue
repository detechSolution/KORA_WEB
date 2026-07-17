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
  itemType: "pass",
  finalPrice: pricing.value.finalPrice,
  memberBenefit: props.pass.discountTag,
  bookingDate: formatDate(state.date, "YYYY-MM-DD"),
  bookingFor: "self",
}));

const schema = [
  // Step 0
  z.object({
    currentUser: z.object({
      fullName: z.string().min(1, "Full name is required"),
      phone: z.string().optional(),
      email: z.string().email("Invalid email").min(1, "Email is required"),
    }),
    guests: z.array(
      z.object({
        fullName: z.string().min(1, "Full name is required"),
        phone: z.string().optional(),
        email: z.string().email("Invalid email").min(1, "Email is required"),
      }),
    ),
  }),
  // Step 1
  z.object({
    date: z.any().refine(v => !!v, "Please select a date"),
  }),
];

const steps = [
  {
    label: "Attendees",
  },
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

// function createGuest(): Guest {
//   return {
//     fullName: "",
//     phone: "",
//     email: "",
//   };
// }

function resetGuests() {
  state.guests = [];
}

// function addGuest() {
//   state.guests.push(createGuest());
// }

function removeGuest(index: number) {
  if (state.guests.length > 0) {
    state.guests.splice(index, 1);
  }
}

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
          <!-- Step 1: Attendees -->
          <div
            v-if="currentStep === 0"
            key="step1"
            class="flex flex-col"
          >
            <div class="mb-8">
              <h2 class="text-3xl font-serif text-foreground mb-3">
                Who's Joining?
              </h2>
              <p class="text-xs text-[#A08860]">
                Add any additional guests joining, or simply click next to
                continue.
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

            <div class="flex flex-col gap-6 mb-8">
              <div
                v-for="(guest, index) in state.guests"
                :key="index"
                class="flex flex-col gap-6 relative"
              >
                <div
                  v-if="index > 0"
                  class="w-full h-1px bg-border/40 mt-2 mb-2"
                />

                <div class="flex items-center justify-between">
                  <h4
                    v-if="index > 0"
                    class="text-sm font-serif text-[#A08860]"
                  >
                    Guest {{ index + 1 }}
                  </h4>
                  <button
                    v-if="state.guests.length > 0"
                    class="text-xs text-red-800 hover:text-red-600 transition-colors flex items-center gap-1 absolute right-0 top-2"
                    @click="removeGuest(index)"
                  >
                    <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5" /> Remove
                  </button>
                </div>

                <base-input
                  v-model="guest.fullName"
                  :name="`guests.${index}.fullName`"
                  label="FULL NAME *"
                  type="text"
                  class="bg-white dark:bg-transparent"
                />

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <base-input
                    v-model="guest.phone"
                    :name="`guests.${index}.phone`"
                    label="PHONE NUMBER"
                    type="text"
                    class="bg-white dark:bg-transparent"
                  />
                  <base-input
                    v-model="guest.email"
                    :name="`guests.${index}.email`"
                    label="EMAIL ADDRESS *"
                    type="email"
                    class="bg-white dark:bg-transparent"
                  />
                </div>
              </div>

              <!-- <base-button
                variant="outline"
                class="w-full border-[#A08860] text-[#A08860] hover:bg-[#A08860]/10 uppercase text-[11px] tracking-widest font-bold h-12 mt-4"
                @click="addGuest"
              >
                ADD GUEST +
              </base-button> -->
            </div>

            <div class="flex justify-end">
              <base-button
                class="uppercase text-[11px] tracking-widest font-bold px-10 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white"
                @click="nextStep"
              >
                Next
              </base-button>
            </div>
          </div>

          <!-- Date  -->
          <div
            v-else-if="currentStep === 1"
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
                class="flex justify-between items-center border-t border-border/40 pt-4 text-foreground"
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
