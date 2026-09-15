<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";
import { computed, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import * as z from "zod";
import { useNotification } from "~/composables/use-notification";
import { useCartStore } from "~/stores/cart";
import { useSpaStore } from "~/stores/spa";
import { getApiErrorMessage } from "~/utils/error";
import { formatDate, formatPrice } from "~/utils/format";
import { calculatePrice } from "~/utils/helper";
import { getMembershipBenefits, getPassesBenefits } from "~/utils/membership";

type Recipient = {
  fullName: string;
  phone: string;
  email: string;
};

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const router = useRouter();
const spaStore = useSpaStore();
const cartStore = useCartStore();
const { error: showError, success } = useNotification();
const formRef = ref<InstanceType<typeof UForm> | null>(null);
const currentStep = ref(0);
const availableTimeSlots = ref<
  { time: string; label: string; availableCapacity?: number }[]
>([]);
const isTimeSlotLoading = ref(false);
const spa = computed(() => spaStore.spa);
const userDetail = JSON.parse(localStorage.getItem("user_data") || "{}");
const benefits = getMembershipBenefits(userDetail);
const passesBenefits = getPassesBenefits(userDetail);
const activeDiscount = computed(() =>
  benefits.member.spa || passesBenefits.spa || 0,
);

const state = reactive({
  recipient: {
    fullName: "",
    phone: "",
    email: "",
  } as Recipient,
  selectedSpa: null as any,
  selectedDate: null as any,
  selectedTime: undefined as string | undefined,
});

const steps = [
  { label: "Recipient Detail" },
  { label: "Select Sub-Type" },
  { label: "Date & Time" },
  { label: "Overview" },
];

const schema = computed(() => [
  z.object({
    recipient: z.object({
      fullName: z.string().trim().min(1, "Full name is required"),
      phone: z.string().trim().optional(),
      email: z.string().trim().email("Please enter a valid email address"),
    }),
  }),
  z.object({
    selectedSpa: z.object({ id: z.union([z.string(), z.number()]) }, {
      message: "Please select a spa treatment",
    }),
  }),
  z.object({
    selectedDate: z.any().refine(value => !!value, "Please select a date"),
    selectedTime: z.string().min(1, "Please select a time"),
  }),
  z.object({}),
]);

const pricing = computed(() =>
  calculatePrice({
    price: state.selectedSpa?.price ?? 0,
    guests: 1,
    discount: activeDiscount.value,
  }),
);

const spaItem = computed(() => ({
  parentId: state.selectedSpa?.referenceId,
  title: state.selectedSpa?.name,
  price: state.selectedSpa?.price,
  duration: state.selectedSpa?.duration,
  timeUnit: state.selectedSpa?.timeUnit,
  bookingDate: formatDate(state.selectedDate, "YYYY-MM-DD"),
  bookingTime: state.selectedTime,
  referenceId: state.selectedSpa?.id,
  itemType: "spa",
  type: "spa",
  image: state.selectedSpa?.image,
  unitPrice: pricing.value.unitPrice,
  unitPriceAfterDiscount: pricing.value.unitPriceAfterDiscount,
  subtotal: pricing.value.subtotal,
  discountAmount: pricing.value.discountAmount,
  finalPrice: pricing.value.finalPrice,
  bookingFor: "recipient",
  isGift: true,
  recipient: { ...state.recipient },
}));

const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
function isDateUnavailable(date: DateValue) {
  if (date.compare(today(getLocalTimeZone())) < 0)
    return true;

  const day = dayMap[date.toDate(getLocalTimeZone()).getDay()];
  return !(spa.value?.availableDays ?? []).includes(day);
}

function selectSpa(spaData: any) {
  state.selectedSpa = spaData;
}

function selectTime(time: string) {
  state.selectedTime = time;
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
      currentStep.value++;
  });
}

function previousStep() {
  if (currentStep.value > 0)
    currentStep.value--;
}

function reset() {
  currentStep.value = 0;
  state.recipient.fullName = "";
  state.recipient.phone = "";
  state.recipient.email = "";
  state.selectedSpa = null;
  state.selectedDate = null;
  state.selectedTime = undefined;
  availableTimeSlots.value = [];
}

function close() {
  reset();
  emit("close");
}

function addToCart() {
  cartStore.addToCart(spaItem.value);
  success({ message: "Gift spa service added to cart successfully!" });
  close();
}

function proceedToCheckout() {
  cartStore.addToCart(spaItem.value);
  close();
  router.push("/checkout");
}

async function fetchAvailableTimes() {
  if (!state.selectedDate || !state.selectedSpa)
    return;

  try {
    isTimeSlotLoading.value = true;
    const response = await spaStore.getAvailableTimes({
      bookingDate: state.selectedDate?.toString?.() ?? state.selectedDate,
      duration: state.selectedSpa.duration,
      timeUnit: state.selectedSpa.timeUnit,
    });
    availableTimeSlots.value = Array.isArray(response) ? response : [];
  }
  catch (error) {
    showError({
      message: getApiErrorMessage(error, "Failed to load available times"),
    });
  }
  finally {
    isTimeSlotLoading.value = false;
  }
}

watch(
  () => state.selectedDate,
  () => {
    state.selectedTime = undefined;
    void fetchAvailableTimes();
  },
);
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
        :schema="schema[currentStep]"
        :state="state"
      >
        <Transition name="fade" mode="out-in">
          <div v-if="currentStep === 0" key="recipient">
            <div class="mb-8">
              <h2 class="text-3xl font-serif text-foreground mb-3">
                Who Is This Gift For?
              </h2>
              <p class="text-xs text-[#A08860]">
                Enter the details of the person receiving this gifted spa package.
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
          </div>

          <div v-else-if="currentStep === 1" key="spa-type">
            <div class="mb-8">
              <h2 class="text-3xl font-serif text-foreground mb-3">
                Select A Spa Type
              </h2>
              <p class="text-xs text-[#A08860]">
                Choose your ideal massage treatment
              </p>
            </div>
            <UFormField name="selectedSpa">
              <UAccordion
                :items="spa?.subTypes"
                class="mb-2"
                :ui="{ item: 'px-[14px] pb-[14px] bg-card' }"
              >
                <template #default="{ item, open }">
                  <div class="flex flex-col">
                    <span class="font-serif text-lg">{{ item.name }}</span>
                    <p class="text-sm text-secondary-500 mt-2" :class="!open && 'line-clamp-2'">
                      {{ item.description }}
                    </p>
                  </div>
                </template>
                <template #content="{ item }">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <button
                      v-for="duration in item.prices"
                      :key="duration.id"
                      type="button"
                      class="border rounded-xs p-4 text-left transition-colors cursor-pointer"
                      :class="state.selectedSpa?.id === duration.id ? 'border-primary bg-primary text-white' : 'border-border bg-[#c9a55a]/10 dark:bg-[#2A2722]'"
                      @click="selectSpa({ ...duration, name: item.name, referenceId: item.id, image: spa?.bannerUrl })"
                    >
                      <span class="flex items-center gap-2 text-sm"><UIcon name="i-lucide-clock" class="h-3.5 w-3.5" />{{ duration.duration }} {{ duration.timeUnit }}</span>
                      <span class="block font-serif text-2xl mt-3">Rs. {{ formatPrice(duration.price) }}</span>
                    </button>
                  </div>
                </template>
              </UAccordion>
            </UFormField>
          </div>

          <div
            v-else-if="currentStep === 2"
            key="date-time"
            class="flex flex-col gap-8"
          >
            <div>
              <h2 class="text-3xl font-serif text-foreground mb-3">
                Choose Your Date & Time
              </h2>
              <p class="text-xs text-[#A08860]">
                Pick a time that works best for your recipient
              </p>
            </div>
            <UFormField name="selectedDate" class="flex flex-col gap-4">
              <p class="text-primary-700 font-medium text-sm">
                SELECT DATE
              </p>
              <UCalendar
                v-model="state.selectedDate"
                :is-date-unavailable="isDateUnavailable"
                :ui="{ headCell: 'text-xs font-normal', gridBody: 'grid gap-2 sm:gap-4', cellTrigger: 'w-full rounded-none flex flex-col h-8 w-8 p-1 sm:h-12 sm:w-12 sm:p-2 border border-border' }"
              />
            </UFormField>
            <div v-if="state.selectedDate">
              <p class="text-primary-700 font-medium text-sm mb-4">
                SELECT TIME
              </p>
              <div v-if="isTimeSlotLoading" class="grid grid-cols-3 gap-4">
                <USkeleton
                  v-for="n in 6"
                  :key="n"
                  class="h-12 rounded-none"
                />
              </div>
              <UFormField v-else-if="availableTimeSlots.length" name="selectedTime">
                <div class="grid grid-cols-3 gap-4">
                  <button
                    v-for="time in availableTimeSlots"
                    :key="time.time"
                    type="button"
                    class="border py-3 text-center text-sm transition-colors cursor-pointer"
                    :class="state.selectedTime === time.time ? 'border-primary bg-primary text-white' : 'border-border hover:border-primary'"
                    @click="selectTime(time.time)"
                  >
                    {{ time.label }}
                  </button>
                </div>
              </UFormField>
              <p v-else class="text-sm text-secondary-500">
                No available times for the selected date.
              </p>
            </div>
          </div>

          <div v-else key="overview">
            <div class="mb-8">
              <h2 class="text-3xl font-serif text-foreground mb-3">
                Review Your Gift Booking
              </h2>
              <p class="text-xs text-[#A08860]">
                Please check the gift details before confirming
              </p>
            </div>
            <h3 class="text-[10px] font-bold tracking-widest uppercase text-[#A08860] mb-2">
              GIFT BOOKING OVERVIEW
            </h3>
            <p class="text-xs text-foreground mb-4">
              Recipient: {{ state.recipient.fullName }}
            </p>
            <div class="border-y border-border/40 py-4">
              <h4 class="font-serif text-lg font-medium text-foreground mb-5">
                Overview
              </h4>
              <div class="flex justify-between items-center text-sm text-foreground">
                <span>{{ state.selectedSpa?.name }} - {{ state.selectedSpa?.duration }} {{ state.selectedSpa?.timeUnit }}</span><span>Rs. {{ formatPrice(pricing.subtotal) }}</span>
              </div>
              <div v-if="pricing.discountAmount > 0" class="flex justify-between items-center text-sm text-muted-foreground mt-3">
                <span>Discount ({{ activeDiscount }}%)</span><span>- Rs. {{ formatPrice(pricing.discountAmount) }}</span>
              </div>
              <div class="flex justify-between items-center border-t border-border/40 pt-4 mt-4 text-foreground">
                <span class="font-serif font-bold text-2xl">Total</span><span class="font-serif font-bold text-2xl">Rs. {{ formatPrice(pricing.finalPrice) }}</span>
              </div>
            </div>
          </div>
        </Transition>
      </UForm>

      <div class="flex flex-col sm:flex-row justify-between gap-4 mt-8">
        <base-button
          v-if="currentStep > 0"
          variant="outline"
          @click="previousStep"
        >
          Back
        </base-button>
        <base-button
          v-if="currentStep < steps.length - 1"
          class="ml-auto uppercase text-[11px] tracking-widest font-bold px-10 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white"
          @click="nextStep"
        >
          Next
        </base-button>
        <div v-else class="ml-auto flex flex-col sm:flex-row gap-2 sm:gap-4">
          <base-button class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none bg-[#1C1C1C] hover:bg-[#111111] dark:bg-black text-white" @click="addToCart">
            Add To Cart
          </base-button>
          <base-button class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none bg-[#A08860] hover:bg-[#8c7550] text-white" @click="proceedToCheckout">
            Proceed To Checkout
          </base-button>
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
