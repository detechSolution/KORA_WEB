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

type Guest = {
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

const spaStore = useSpaStore();
const { error: showError, success } = useNotification();
const cartStore = useCartStore();
const spa = computed(() => spaStore.spa);

const steps = [
  { label: "Select Sub-Type" },
  { label: "Date & Time" },
  { label: "Attendees" },
  { label: "Overview" },
];

const router = useRouter();
const currentStep = ref(0);
const formRef = ref<InstanceType<typeof UForm> | null>(null);
const availableTimeSlots = ref<{ time: string; label: string }[]>([]);
const isTimeSlotLoading = ref(false);
const selectedSpaModel = defineModel<any>("selectedSpa");

function isDateUnavailable(date: DateValue) {
  return date.compare(today(getLocalTimeZone())) < 0;
}

const defaultOpenSubtype = computed(() => {
  if (!selectedSpaModel.value?.referenceId || !spa.value?.subTypes)
    return undefined;
  const index = spa.value.subTypes.findIndex(
    (st: any) => st.id === selectedSpaModel.value.referenceId,
  );
  return index !== -1 ? String(index) : undefined;
});

const userDetail = JSON.parse(localStorage.getItem("user_data") || "{}");
const benefits = getMembershipBenefits(userDetail);
const passesBenefits = getPassesBenefits(userDetail);
const MEMBERSHIP_DISCOUNT = benefits.member.spa || 0;
const PASS_DISCOUNT = passesBenefits.spa || 0;
const GUEST_DISCOUNT = benefits.guest.spa || 0;

const state = reactive({
  bookingPreference: null as "myself" | "guest" | null,
  selectedSpa: null as any,
  selectedDate: null as any,
  selectedTime: undefined as string | undefined,
  currentUser: {
    fullName: userDetail?.fullName || userDetail?.name || "You",
    phone: userDetail?.phone || "",
    email: userDetail?.email || "",
  },
  guests: [] as Guest[],
});

const activeDiscount = computed(() => {
  return state.bookingPreference === "myself"
    ? MEMBERSHIP_DISCOUNT || PASS_DISCOUNT
    : GUEST_DISCOUNT;
});

const hasMembership = computed(() => {
  return !!userDetail?.membership?.membershipPlanId;
});

const showDiscount = computed(() => activeDiscount.value > 0);

const schema = computed(() => [
  // Step 0
  z.object({
    selectedSpa: z.object(
      { id: z.number() },
      {
        message: "Please select a spa",
      },
    ),
  }),
  // Step 1
  z.object({
    selectedDate: z.any().refine(v => !!v, "Please select a date"),
    selectedTime: z
      .string({ message: "Please select a time" })
      .min(1, "Please select a time"),
  }),
  // Step 2
  z.object({
    ...(state.bookingPreference === "myself"
      ? {
          currentUser: z.object({
            fullName: z.string().min(1, "Full name is required"),
            phone: z.string().optional(),
            email: z.string().email("Invalid email").optional(),
          }),
        }
      : {}),
    ...(state.bookingPreference === "guest"
      ? {
          guests: z
            .array(
              z.object({
                fullName: z.string().min(1, "Please enter the full name"),
                phone: z.string().optional(),
                email: z
                  .string()
                  .email("Invalid email")
                  .min(1, "Email is required"),
              }),
            )
            .min(1, "At least one guest is required"),
        }
      : {}),
  }),
  // Step 3
  z.object({}),
]);

function createGuest(): Guest {
  return { fullName: "", phone: "", email: "" };
}

function resetGuests() {
  state.guests = [];
}

function addGuest() {
  state.guests.push(createGuest());
}

function removeGuest(index: number) {
  if (state.guests.length > 0)
    state.guests.splice(index, 1);
}

function selectPreference(type: "myself" | "guest") {
  state.bookingPreference = type;
  if (type === "guest" && state.guests.length === 0) {
    addGuest();
  }
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
  if (currentStep.value === 0) {
    state.bookingPreference = null;
    resetGuests();
    return;
  }

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
  state.bookingPreference = null;
  state.selectedSpa = null;
  state.selectedDate = null;
  state.selectedTime = undefined;
  selectedSpaModel.value = null;
  resetGuests();
  currentStep.value = 0;
  emit("close");
}

const pricing = computed(() => {
  let count = 0;
  let discount = 0;
  if (state.bookingPreference === "myself") {
    count = 1;
    discount = MEMBERSHIP_DISCOUNT || PASS_DISCOUNT;
  }
  else if (state.bookingPreference === "guest") {
    count = state.guests.length;
    discount = GUEST_DISCOUNT;
  }
  else {
    count = state.guests.length + 1;
  }
  return calculatePrice({
    price: state.selectedSpa?.price,
    guests: count,
    discount,
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
  visitors: state.guests,
  referenceId: state.selectedSpa?.id,
  itemType: "spa",
  type: "spa",
  image: state.selectedSpa?.image,
  unitPrice: pricing.value.unitPrice,
  unitPriceAfterDiscount: pricing.value.unitPriceAfterDiscount,
  subtotal: pricing.value.subtotal,
  discountAmount: pricing.value.discountAmount,
  finalPrice: pricing.value.finalPrice,
  bookingFor: state.bookingPreference === "myself" ? "self" : "visitor",
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

onMounted(() => {
  try {
    const raw = localStorage.getItem("user_data");
    if (raw) {
      const user = JSON.parse(raw);
      state.currentUser = {
        fullName: user.name ?? "",
        phone: user.phone ?? "",
        email: user.email ?? "",
      };
    }
  }
  catch (error) {
    console.error(error);
  }

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
      <Transition name="fade" mode="out-in">
        <!-- Preference Selection -->
        <div
          v-if="!state.bookingPreference"
          key="step-preference"
          class="flex flex-col items-center py-4"
        >
          <div class="mb-10 text-center">
            <h2 class="text-3xl font-serif text-foreground mb-3">
              How Would You Like To Book?
            </h2>
            <p class="text-sm text-[#A08860]">
              Select your booking preference to continue
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <!-- Book For Myself Card -->
            <div
              class="border border-border p-8 flex flex-col items-center text-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
              @click="selectPreference('myself')"
            >
              <div
                class="w-20 h-20 rounded-full bg-[#f4ebd9] dark:bg-[#A08860]/20 flex items-center justify-center mb-6"
              >
                <UIcon name="i-lucide-user" class="w-8 h-8 text-primary-700" />
              </div>
              <h3 class="text-2xl font-serif mb-4 text-foreground">
                Book For Myself
              </h3>
              <div
                class="w-12 h-px bg-border/40 mb-4 transition-all group-hover:w-20 group-hover:bg-[#A08860]"
              />
              <p class="text-sm text-muted-foreground mb-4">
                Manage your personal bookings & appointments
              </p>
              <button
                class="text-xs font-bold text-primary-700 tracking-widest uppercase flex items-center gap-2 mt-auto cursor-pointer"
              >
                GET STARTED
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
              </button>
            </div>

            <!-- Book For Guest Card -->
            <div
              class="border border-border p-8 flex flex-col items-center text-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
              :class="{
                'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5':
                  hasMembership,
                'opacity-50 cursor-not-allowed pointer-events-none':
                  !hasMembership,
              }"
              @click="selectPreference('guest')"
            >
              <div
                class="w-20 h-20 rounded-full bg-[#f4ebd9] dark:bg-[#A08860]/20 flex items-center justify-center mb-6"
              >
                <UIcon name="i-lucide-users" class="w-8 h-8 text-primary-700" />
              </div>
              <h3 class="text-2xl font-serif mb-4 text-foreground">
                Book For Guest
              </h3>
              <div
                class="w-12 h-px bg-border/40 mb-4 transition-all group-hover:w-20 group-hover:bg-[#A08860]"
              />
              <p class="text-sm text-muted-foreground mb-4">
                Book on behalf of someone else such as friends or family
                members.
              </p>
              <button
                class="text-xs font-bold text-primary-700 tracking-widest uppercase flex items-center gap-2 mt-auto cursor-pointer"
              >
                GET STARTED
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Form and Stepper -->
        <div
          v-else
          key="booking-form"
          class="flex flex-col"
        >
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
                      item: 'px-[14px] pb-[14px]',
                    }"
                  >
                    <template #default="{ item }">
                      <div class="flex flex-col">
                        <span>{{ item.name }}</span>
                        <p
                          class="text-sm text-foreground/80 dark:text-secondary-500 mt-4"
                        >
                          {{ item.description }}
                        </p>
                      </div>
                    </template>

                    <template #content="{ item }">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                            {{ duration.price }}
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

              <!-- Step 2: Attendees -->
              <div
                v-else-if="currentStep === 2"
                key="step2"
                class="flex flex-col"
              >
                <div class="mb-8">
                  <h2 class="text-3xl font-serif text-foreground mb-3">
                    {{
                      state.bookingPreference === "myself"
                        ? "Your Details"
                        : "Guest Details"
                    }}
                  </h2>
                  <p class="text-xs text-[#A08860]">
                    {{
                      state.bookingPreference === "myself"
                        ? "Please confirm your details for the booking."
                        : "Add the details of the guest joining the session."
                    }}
                  </p>
                </div>
                <div class="w-full h-px bg-border/40 mb-8" />

                <!-- Current User Details (Myself) -->
                <div
                  v-if="state.bookingPreference === 'myself'"
                  class="flex flex-col gap-6 mb-8"
                >
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

                <!-- Guest Details (Guest) -->
                <div
                  v-if="state.bookingPreference === 'guest'"
                  class="flex flex-col gap-6 mb-8"
                >
                  <div
                    v-for="(guest, index) in state.guests"
                    :key="index"
                    class="relative flex flex-col gap-6"
                  >
                    <div v-if="index > 0" class="w-full h-px bg-border/40" />

                    <div class="flex items-center justify-between">
                      <h4
                        v-if="index > 0"
                        class="text-sm font-serif text-[#A08860]"
                      >
                        Guest {{ index + 1 }}
                      </h4>

                      <button
                        v-if="state.guests.length > 1"
                        class="absolute top-0 right-0 flex items-center gap-1 text-xs text-red-800 hover:text-red-600 transition-colors hover:cursor-pointer"
                        @click="removeGuest(index)"
                      >
                        <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5" />
                        Remove
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

                  <base-button
                    variant="outline"
                    class="w-full border-[#A08860] text-[#A08860] hover:bg-[#A08860]/10 uppercase text-[11px] tracking-widest font-bold h-12 mt-4"
                    @click="addGuest"
                  >
                    ADD ANOTHER GUEST +
                  </base-button>
                </div>
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
                        {{ state.selectedSpa?.price }} ×
                        {{
                          state.bookingPreference === "myself"
                            ? 1
                            : state.guests.length
                        }})
                      </span>
                      <span>Rs. {{ formatPrice(pricing.subtotal) }}</span>
                    </div>

                    <div
                      v-if="showDiscount"
                      class="flex justify-between text-sm font-normal text-secondary-500 dark:text-secondary-400"
                    >
                      <h2>Membership Discount ({{ activeDiscount }}%)</h2>
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
            class="flex flex-col sm:flex-row gap-4 mt-8"
            :class="currentStep === 0 ? 'justify-end' : 'justify-between'"
          >
            <base-button variant="outline" @click="previousStep">
              Back
            </base-button>

            <base-button
              v-if="currentStep < steps.length - 1"
              class="uppercase text-[11px] tracking-widest font-bold px-8 h-11 rounded-none text-white"
              :class="
                currentStep === 0
                  ? 'ml-auto bg-[#A08860] hover:bg-[#8c7550]'
                  : 'bg-[#A08860] hover:bg-[#8c7550]'
              "
              @click="nextStep"
            >
              NEXT
            </base-button>

            <div v-else class="flex gap-4">
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
