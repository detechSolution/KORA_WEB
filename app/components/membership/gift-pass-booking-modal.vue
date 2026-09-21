<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import type { PropType } from "vue";
import type { Passes } from "~/types/membership";
import { getLocalTimeZone, today } from "@internationalized/date";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import * as z from "zod";
import { useNotification } from "~/composables/use-notification";
import { useCartStore } from "~/stores/cart";
import { formatDate } from "~/utils/format";

type Recipient = {
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
    type: Object as PropType<Passes>,
    required: true,
  },
});

const emit = defineEmits<{
  close: [];
}>();

const router = useRouter();
const cartStore = useCartStore();
const { success } = useNotification();
const formRef = ref<InstanceType<typeof UForm> | null>(null);
const currentStep = ref(0);
const state = reactive({
  recipient: {
    fullName: "",
    phone: "",
    email: "",
  } as Recipient,
  date: null as any,
});

const steps = [
  { label: "Recipient Detail" },
  { label: "Date" },
  { label: "Overview" },
];

const schemas = [
  // Step 0 — Recipient
  z.object({
    recipient: z.object({
      fullName: z.string().trim().min(1, "Full name is required"),
      phone: z.string().trim().optional(),
      email: z.string().trim().email("Please enter a valid email address"),
    }),
  }),
  // Step 1 — Date
  z.object({
    date: z.any().refine(v => !!v, "Please select a date"),
  }),
];

const price = computed(() => Number(props.pass?.price ?? 0));
const formattedPrice = computed(() =>
  new Intl.NumberFormat("en-IN").format(price.value),
);

const passItem = computed(() => ({
  referenceId: props.pass.id,
  title: props.pass.name,
  price: price.value,
  finalPrice: price.value,
  itemType: "pass",
  isGift: true,
  recipient: { ...state.recipient },
  bookingDate: formatDate(state.date, "YYYY-MM-DD"),
}));

function isDateUnavailable(date: DateValue) {
  return date.compare(today(getLocalTimeZone())) < 0;
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

function reset() {
  currentStep.value = 0;
  state.recipient.fullName = "";
  state.recipient.phone = "";
  state.recipient.email = "";
  state.date = null;
}

function close() {
  reset();
  emit("close");
}

function goToStep(step: number) {
  if (step <= currentStep.value) {
    currentStep.value = step;
    return;
  }

  void validateCurrentStep().then((isValid) => {
    if (isValid)
      currentStep.value = step;
  });
}

function nextStep() {
  void validateCurrentStep().then((isValid) => {
    if (isValid && currentStep.value < steps.length - 1)
      currentStep.value += 1;
  });
}

function previousStep() {
  if (currentStep.value > 0)
    currentStep.value -= 1;
}

function addToCart() {
  cartStore.addToCart(passItem.value);
  success({ message: "Gift pass added to cart successfully!" });
  close();
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
    <div class="p-6 md:p-12">
      <base-form-stepper
        :steps="steps"
        :current-step="currentStep"
        orientation="horizontal"
        class="mb-8"
        @select="goToStep"
      />

      <UForm
        ref="formRef"
        :schema="schemas[currentStep]"
        :state="state"
      >
        <Transition name="fade" mode="out-in">
          <!-- Step 1: Recipient Details -->
          <div v-if="currentStep === 0" key="recipient">
            <div class="mb-8">
              <h2 class="text-3xl font-serif text-foreground mb-3">
                Who Is This Gift For?
              </h2>
              <p class="text-xs text-[#A08860]">
                Enter the details of the person receiving this gifted pass.
              </p>
            </div>

            <div class="border-t border-border/40 pt-6">
              <base-input
                v-model="state.recipient.fullName"
                name="recipient.fullName"
                label="FULL NAME *"
                placeholder="Enter recipient's full name"
                type="text"
                class="bg-white dark:bg-transparent"
              />

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <base-input
                  v-model="state.recipient.phone"
                  name="recipient.phone"
                  label="PHONE NUMBER"
                  placeholder="Enter recipient's phone number"
                  type="text"
                  class="bg-white dark:bg-transparent"
                />
                <base-input
                  v-model="state.recipient.email"
                  name="recipient.email"
                  label="EMAIL ADDRESS *"
                  placeholder="Enter recipient's email"
                  type="email"
                  class="bg-white dark:bg-transparent"
                />
              </div>
            </div>

            <div class="border-b border-border/40 pb-6 mt-6 mb-8" />

            <div class="flex justify-end">
              <base-button
                class="uppercase text-[11px] tracking-widest font-bold px-10 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white"
                @click="nextStep"
              >
                Next
              </base-button>
            </div>
          </div>

          <!-- Step 2: Date -->
          <div
            v-else-if="currentStep === 1"
            key="date"
            class="flex flex-col gap-8"
          >
            <div>
              <h2 class="text-3xl font-serif text-foreground mb-3">
                Choose Start Date
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

            <div class="flex flex-col sm:flex-row justify-between gap-4 mt-auto">
              <base-button variant="outline" @click="previousStep">
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

          <!-- Step 3: Overview -->
          <div v-else key="overview">
            <div class="mb-8">
              <h2 class="text-3xl font-serif text-foreground mb-3">
                Gift A Pass
              </h2>
              <p class="text-xs text-[#A08860]">
                Give the gift of wellness
              </p>
            </div>

            <h3 class="text-[10px] font-bold tracking-widest uppercase text-[#A08860] mb-2">
              GIFT BOOKING OVERVIEW
            </h3>
            <div class="flex gap-2 text-secondary-500">
              <div class="flex gap-1">
                <UIcon name="i-lucide-user" class="w-3.5 h-3.5" />
                <p class="text-xs text-secondary-500 mb-4">
                  {{ state.recipient.fullName }}
                </p>
              </div>
              <div class="flex gap-1">
                <UIcon name="i-lucide-user" class="w-3.5 h-3.5" />
                <p class="text-xs text-secondary-500 mb-4">
                  {{ state.recipient.email }}
                </p>
              </div>
              <div class="flex gap-1">
                <UIcon name="i-lucide-user" class="w-3.5 h-3.5" />
                <p class="text-xs text-secondary-500 mb-4">
                  {{ state.recipient.phone }}
                </p>
              </div>
            </div>

            <div class="border-y border-border/40 py-4">
              <h4 class="font-serif text-lg font-medium text-foreground mb-5">
                Overview
              </h4>
              <div class="flex justify-between items-center text-sm text-foreground">
                <span>{{ pass.name }}</span>
                <span>Rs. {{ formattedPrice }}</span>
              </div>
              <div
                v-if="pass.discount"
                class="flex justify-between items-center text-sm text-muted-foreground mt-2"
              >
                <span>Discount</span>
                <span>{{ pass.discount }}% off on Spa / Cafe / Salon</span>
              </div>
              <div class="flex justify-between items-center border-t border-border/40 pt-4 mt-4 text-foreground text-2xl">
                <span class="font-serif font-bold">Total</span>
                <span class="font-serif font-bold">Rs. {{ formattedPrice }}</span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-between gap-4 mt-8">
              <base-button variant="outline" @click="previousStep">
                Back
              </base-button>
              <div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <base-button
                  class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none bg-[#1C1C1C] hover:bg-[#111111] dark:bg-black dark:hover:bg-[#111] text-white"
                  @click="addToCart"
                >
                  Add To Cart
                </base-button>
                <base-button
                  class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white"
                  @click="proceedToCheckout"
                >
                  Proceed To Checkout
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
