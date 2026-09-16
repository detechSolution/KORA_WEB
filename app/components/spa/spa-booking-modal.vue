<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import * as z from "zod";

import { useNotification } from "~/composables/use-notification";

import { useCartStore } from "~/stores/cart";
import { useSpaStore } from "~/stores/spa";

import { getApiErrorMessage } from "~/utils/error";
import { formatDate, formatPrice } from "~/utils/format";
import { calculatePrice } from "~/utils/helper";
import { getMembershipBenefits, getPassesBenefits } from "~/utils/membership";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const spaStore = useSpaStore();
const { error: showError, success } = useNotification();
const cartStore = useCartStore();
const spa = computed(() => spaStore.spa);

const steps = [
  { label: "Select Sub-Type" },
  { label: "Date & Time" },
  { label: "Room Preference" },
  { label: "Overview" },
];

const router = useRouter();
const currentStep = ref(0);
const formRef = ref<InstanceType<typeof UForm> | null>(null);
const availableTimeSlots = ref<
  { time: string; label: string; availableCapacity?: number }[]
>([]);
const isTimeSlotLoading = ref(false);
const selectedSpaModel = defineModel<any>("selectedSpa");

const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
function isDateUnavailable(date: DateValue) {
  if (date.compare(today(getLocalTimeZone())) < 0) {
    return true;
  }

  const day = dayMap[date.toDate(getLocalTimeZone()).getDay()];
  return !(spa.value?.availableDays ?? []).includes(day);
}

const defaultOpenSubtype = computed(() => {
  if (!selectedSpaModel.value?.referenceId || !spa.value?.subTypes)
    return "0";
  const index = spa.value.subTypes.findIndex(
    (st: any) => st.id === selectedSpaModel.value.referenceId,
  );
  return index !== -1 ? String(index) : "0";
});

const userDetail = JSON.parse(localStorage.getItem("user_data") || "{}");
const benefits = getMembershipBenefits(userDetail);
const passesBenefits = getPassesBenefits(userDetail);
const MEMBERSHIP_DISCOUNT = benefits.member.spa || 0;
const PASS_DISCOUNT = passesBenefits.spa || 0;

const state = reactive({
  selectedSpa: null as any,
  selectedDate: null as any,
  selectedTime: undefined as string | undefined,
  roomPreference: "" as "private" | "shared" | "",
});

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
  return MEMBERSHIP_DISCOUNT || PASS_DISCOUNT;
});

const showDiscount = computed(() => activeDiscount.value > 0);

const schema = computed(() => [
  // Step 0: Select Sub-Type
  z.object({
    selectedSpa: z.object(
      { id: z.number() },
      {
        message: "Please select a spa",
      },
    ),
  }),
  // Step 1: Date & Time
  z.object({
    selectedDate: z.any().refine(v => !!v, "Please select a date"),
    selectedTime: z
      .string({ message: "Please select a time" })
      .min(1, "Please select a time"),
  }),
  // Step 2: Room Preference
  z.object({
    roomPreference: z.string().min(1, "Please select a room preference"),
  }),
  // Step 3: Overview
  z.object({}),
]);

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
    if (isValid && currentStep.value < steps.length - 1) {
      currentStep.value += 1;
    }
  });
}

function previousStep() {
  if (currentStep.value > 0)
    currentStep.value--;
}

function handleBookingClick(spaData: any) {
  state.selectedSpa = spaData;
  selectedSpaModel.value = spaData;
}

function selectTime(time: string) {
  state.selectedTime = time;
}

function close() {
  state.selectedSpa = null;
  state.selectedDate = null;
  state.selectedTime = undefined;
  state.roomPreference = "";
  selectedSpaModel.value = null;
  currentStep.value = 0;
  emit("close");
}

const guestCount = computed(() =>
  state.roomPreference === "shared" ? 2 : 1,
);

const pricing = computed(() => {
  return calculatePrice({
    price: state.selectedSpa?.price,
    guests: guestCount.value,
    discount: activeDiscount.value,
  });
});

const spaItem = computed(() => ({
  parentId: state.selectedSpa?.referenceId,
  title: state.selectedSpa?.name,
  price: state.selectedSpa?.price,
  duration: state.selectedSpa?.duration,
  timeUnit: state.selectedSpa?.timeUnit,
  bookingDate: formatDate(state.selectedDate, "YYYY-MM-DD"),
  bookingTime: state.selectedTime,
  roomPreference: state.roomPreference,
  guests: guestCount.value,
  visitors: [],
  referenceId: state.selectedSpa?.id,
  itemType: "spa",
  type: "spa",
  image: state.selectedSpa?.image,
  unitPrice: pricing.value.unitPrice,
  unitPriceAfterDiscount: pricing.value.unitPriceAfterDiscount,
  subtotal: pricing.value.subtotal,
  discountAmount: pricing.value.discountAmount,
  finalPrice: pricing.value.finalPrice,
}));

function addToCart() {
  cartStore.addToCart(spaItem.value);
  success({ message: "Item added to cart successfully!" });
}

function proceedToCheckout() {
  cartStore.addToCart(spaItem.value);
  success({ message: "Item added to cart successfully!" });
  router.push("/checkout");
  close();
}

async function fetchAvailableTimes() {
  if (!state.selectedDate || !state.selectedSpa)
    return;
  try {
    isTimeSlotLoading.value = true;
    const params = {
      bookingDate: state.selectedDate?.toString?.() ?? state.selectedDate,
      duration: state.selectedSpa?.duration,
      timeUnit: state.selectedSpa?.timeUnit,
    };
    const response = await spaStore.getAvailableTimes(params);
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

onMounted(async () => {
  if (selectedSpaModel.value) {
    state.selectedSpa = selectedSpaModel.value;
  }
});

watch(
  () => state.selectedDate,
  () => {
    state.selectedTime = undefined;
    fetchAvailableTimes();
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
    <div class="p-4 flex flex-col gap-6">
      <!-- Form and Stepper -->
      <div class="flex flex-col">
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
            <!-- Step 0: Select Spa Type -->
            <div
              v-if="currentStep === 0"
              key="step0"
              class="flex flex-col"
            >
              <div class="mb-8">
                <h2 class="text-3xl font-serif text-foreground mb-3">
                  Select a Spa Type
                </h2>
                <p class="text-xs text-[#A08860]">
                  Choose your ideal massage treatment
                </p>
              </div>

              <UFormField name="selectedSpa">
                <UAccordion
                  :items="spa?.subTypes"
                  :default-value="defaultOpenSubtype"
                  class="mb-2"
                  :ui="{
                    item: 'px-[14px] pb-[14px] bg-card',
                  }"
                >
                  <template #default="{ item, open }">
                    <div class="flex flex-col">
                      <span>{{ item.name }}</span>
                      <p
                        class="text-sm text-secondary-500 mt-4"
                        :class="[
                          !open && 'line-clamp-2',
                        ]"
                      >
                        {{ item.description }}
                      </p>
                    </div>
                  </template>

                  <template #content="{ item }">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div
                        v-for="duration in item.prices"
                        :key="duration.id"
                        class="group relative border border-white/10 rounded-xs p-4 flex flex-col justify-between transition-all duration-300 cursor-pointer"
                        :class="
                          state.selectedSpa?.id === duration.id
                            ? 'bg-primary-500 text-white dark:bg-primary'
                            : 'bg-[#c9a55a]/10 dark:bg-[#2A2722]'
                        "
                        @click="
                          handleBookingClick({
                            ...duration,
                            name: item.name,
                            referenceId: item.id,
                            image: spa?.bannerUrl,
                          })
                        "
                      >
                        <div
                          class="flex items-center gap-2 text-xs uppercase"
                          :class="
                            state.selectedSpa?.id === duration.id
                              ? 'text-white'
                              : 'text-primary-700'
                          "
                        >
                          <UIcon name="i-lucide-clock" class="h-3.5 w-3.5" />
                          <span class="text-sm">
                            {{ duration.duration }} {{ duration.timeUnit }}
                          </span>
                        </div>
                        <p class="text-3xl font-medium text-foreground mt-3">
                          <span class="text-2xl">Rs. </span>{{ duration.price }}
                        </p>
                      </div>
                    </div>
                  </template>
                </UAccordion>
              </UFormField>
            </div>

            <!-- Step 1: Date & Time -->
            <div
              v-else-if="currentStep === 1"
              key="step1"
              class="flex flex-col gap-8"
            >
              <div>
                <h2 class="text-3xl font-serif text-foreground mb-3">
                  Choose Your Date & Time
                </h2>
                <p class="text-xs text-[#A08860]">
                  Pick a time that works best for your relaxation
                </p>
              </div>

              <UFormField
                name="selectedDate"
                class="flex flex-col gap-4 border-b border-border pb-6"
              >
                <p class="text-primary-700 font-medium text-sm capitalize">
                  Select Date
                </p>
                <UCalendar
                  v-model="state.selectedDate"
                  :is-date-unavailable="isDateUnavailable"
                  :ui="{
                    headCell: 'text-xs font-normal',
                    gridBody: 'grid gap-2 sm:gap-4',
                    cellTrigger:
                      'w-full rounded-none flex flex-col h-8 w-8 p-1 sm:h-12 sm:w-12 sm:p-2 border border-border',
                  }"
                />
              </UFormField>

              <div>
                <!-- Loading skeleton -->
                <div
                  v-if="isTimeSlotLoading"
                  class="flex flex-col gap-4 mb-6"
                >
                  <p
                    class="text-primary-700 font-medium mb-2 text-sm capitalize"
                  >
                    Select Time
                  </p>
                  <div class="grid grid-cols-3 gap-4">
                    <div
                      v-for="n in 6"
                      :key="n"
                      class="h-[56px] border border-border bg-stone-100 dark:bg-[#2A2722] animate-pulse"
                    />
                  </div>
                </div>

                <UFormField
                  v-else-if="availableTimeSlots.length > 0"
                  name="selectedTime"
                  class="flex flex-col gap-4 mb-6"
                >
                  <p
                    class="text-primary-700 font-medium mb-2 text-sm capitalize"
                  >
                    Select Time
                  </p>
                  <div class="grid grid-cols-3 gap-4">
                    <div
                      v-for="time in availableTimeSlots"
                      :key="time.time"
                      class="border py-4 text-center transition-colors cursor-pointer"
                      :class="
                        state.selectedTime === time.time
                          ? 'border-primary-500 bg-primary-700 text-white'
                          : 'border-stone-200 dark:border-border dark:text-white hover:border-primary-500'
                      "
                      @click="selectTime(time.time)"
                    >
                      {{ time?.label }}
                    </div>
                  </div>
                </UFormField>

                <div v-else class="py-6">
                  <p>No available times for the selected date.</p>
                </div>
              </div>
            </div>

            <!-- Step 2: Room Preference -->
            <div
              v-else-if="currentStep === 2"
              key="step2"
              class="flex flex-col"
            >
              <div class="mb-8">
                <h2 class="text-3xl font-serif text-foreground mb-3">
                  Room Preference
                </h2>
                <p class="text-xs text-[#A08860]">
                  Choose your preferred spa environment
                </p>
              </div>
              <div class="w-full h-px bg-border/40 mb-8" />

              <UFormField name="roomPreference">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Private Room Card -->
                  <div
                    class="group relative border rounded-xs p-6 flex flex-col gap-4 transition-all duration-300 cursor-pointer"
                    :class="
                      state.roomPreference === 'private'
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-border bg-card hover:border-primary-400'
                    "
                    @click="state.roomPreference = 'private'"
                  >
                    <div class="flex items-center justify-between">
                      <div
                        class="flex items-center justify-center w-10 h-10 rounded-full"
                        :class="
                          state.roomPreference === 'private'
                            ? 'bg-primary-500 text-white'
                            : 'bg-[#c9a55a]/10 text-primary-700'
                        "
                      >
                        <UIcon name="i-lucide-door-closed" class="w-5 h-5" />
                      </div>
                      <div
                        class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                        :class="
                          state.roomPreference === 'private'
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-border'
                        "
                      >
                        <div
                          v-if="state.roomPreference === 'private'"
                          class="w-2 h-2 rounded-full bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 class="font-serif text-lg font-medium text-foreground mb-1">
                        Private Room
                      </h3>
                      <p class="text-sm text-secondary-500">
                        Enjoy your treatment in an exclusive private room for a fully personalized experience.
                      </p>
                    </div>
                  </div>

                  <!-- Shared Spa Card -->
                  <div
                    class="group relative border rounded-xs p-6 flex flex-col gap-4 transition-all duration-300 cursor-pointer"
                    :class="
                      state.roomPreference === 'shared'
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-border bg-card hover:border-primary-400'
                    "
                    @click="state.roomPreference = 'shared'"
                  >
                    <div class="flex items-center justify-between">
                      <div
                        class="flex items-center justify-center w-10 h-10 rounded-full"
                        :class="
                          state.roomPreference === 'shared'
                            ? 'bg-primary-500 text-white'
                            : 'bg-[#c9a55a]/10 text-primary-700'
                        "
                      >
                        <UIcon name="i-lucide-users" class="w-5 h-5" />
                      </div>
                      <div
                        class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                        :class="
                          state.roomPreference === 'shared'
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-border'
                        "
                      >
                        <div
                          v-if="state.roomPreference === 'shared'"
                          class="w-2 h-2 rounded-full bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 class="font-serif text-lg font-medium text-foreground mb-1">
                        Shared Spa
                      </h3>
                      <p class="text-sm text-secondary-500">
                        Relax in our communal spa area, perfect for a social wellness experience.
                      </p>
                    </div>
                  </div>
                </div>
              </UFormField>
            </div>

            <!-- Step 3: Overview -->
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
                  Please check your reservation details before confirming
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
                      {{ state.selectedSpa?.name }} (Rs.
                      {{ state.selectedSpa?.price }} &times; {{ guestCount }})
                    </span>
                    <span>Rs. {{ formatPrice(pricing.subtotal) }}</span>
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
                  class="flex justify-between items-center border-t border-border/40 pt-4 text-foreground"
                >
                  <span class="font-serif font-bold">Total</span>
                  <span class="font-serif font-bold">
                    Rs. {{ formatPrice(pricing.finalPrice) }}
                  </span>
                </div>
                <div class="border-b border-border/40 pb-6 mb-8" />
              </div>
            </div>
          </Transition>
        </UForm>

        <div
          class="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-8"
          :class="currentStep === 0 ? 'justify-end' : 'justify-between'"
        >
          <base-button variant="outline" @click="previousStep">
            Back
          </base-button>

          <base-button
            v-if="currentStep < steps.length - 1"
            class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none text-white w-full sm:w-auto"
            :class="
              currentStep === 0
                ? 'ml-auto bg-[#A08860] hover:bg-[#8c7550]'
                : 'bg-[#A08860] hover:bg-[#8c7550]'
            "
            @click="nextStep"
          >
            NEXT
          </base-button>

          <div v-else class="flex flex-col sm:flex-row gap-2 sm:gap-4">
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
