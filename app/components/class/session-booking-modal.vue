<script setup lang="ts">
import type { PropType } from "vue";
import type { Session } from "~/types/session";
import { computed, reactive, ref } from "vue";

import { useRouter } from "vue-router";
import * as z from "zod";

import { useNotification } from "~/composables/use-notification";

import { useCartStore } from "~/stores/cart";
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
const formRef = ref<InstanceType<typeof UForm> | null>(null);
const steps = [{ label: "Attendees" }, { label: "Overview" }];
const userDetail = JSON.parse(localStorage.getItem("user_data") || "{}");
const state = reactive({
  bookingPreference: null as "myself" | "guest" | null,
  currentUser: {
    fullName: userDetail?.fullName || userDetail?.name || "You",
    phone: userDetail?.phone || "",
    email: userDetail?.email || "",
  },
  guests: [] as Guest[],
});

const schema = computed(() => [
  z.object({
    ...(state.bookingPreference === "myself"
      ? {
          currentUser: z.object({
            fullName: z.string().min(1, "Full name is required"),
            phone: z.string().optional(),
            email: z
              .string()
              .email("Invalid email")
              .optional(),
          }),
        }
      : {}),
    ...(state.bookingPreference === "guest"
      ? {
          guests: z.array(
            z.object({
              fullName: z.string().min(1, "Full name is required"),
              phone: z.string().optional(),
              email: z
                .string()
                .email("Invalid email")
                .min(1, "Email is required"),
            }),
          ),
        }
      : {}),
  }),
]);

function createGuest(): Guest {
  return {
    fullName: "",
    phone: "",
    email: "",
  };
}

function resetGuests() {
  state.guests = [];
}
function addGuest() {
  state.guests.push(createGuest());
}

function removeGuest(index: number) {
  if (state.guests.length <= 0)
    return;

  state.guests.splice(index, 1);
}

function selectPreference(type: "myself" | "guest") {
  state.bookingPreference = type;
  if (type === "guest" && state.guests.length === 0) {
    addGuest();
  }
}

function goBackToPreference() {
  state.bookingPreference = null;
  resetGuests();
}

const CLASS_DISCOUNT = userDetail?.membership?.plan?.classBenefit || 0;

const pricing = computed(() => {
  let count = 0;
  let discount = 0;
  if (state.bookingPreference === "myself") {
    count = 1;
    discount = CLASS_DISCOUNT;
  }
  else if (state.bookingPreference === "guest") {
    count = state.guests.length;
  }
  else {
    count = state.guests.length + 1;
  }
  return calculatePrice({
    price: props.session.price,
    guests: count,
    discount,
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

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value -= 1;
  }
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
  visitors: state.guests,
  subtotal: pricing.value.subtotal,
  // membershipDiscount: MEMBERSHIP_DISCOUNT,
  // promoDiscount: PROMO_DISCOUNT,
  discountAmount: pricing.value.discountAmount,
  finalPrice: pricing.value.finalPrice,
  itemType: "session",
  bookingFor: state.bookingPreference === "myself" ? "self" : "visitor",
}));

function addToCart() {
  cartStore.addToCart(bookingItem.value);
  success({ message: "Item added to cart successfully!" });
}

function proceedToCheckout() {
  cartStore.addToCart(bookingItem.value);
  router.push("/checkout");
  close();
}

function close() {
  currentStep.value = 0;
  state.bookingPreference = null;
  resetGuests();
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

                <div class="flex justify-between items-center mt-4">
                  <base-button variant="outline" @click="goBackToPreference">
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
                        {{ session.name }} (Rs. {{ session.price }} ×
                        {{
                          state.bookingPreference === "myself"
                            ? 1
                            : state.guests.length
                        }})
                      </span>

                      <span> Rs. {{ formatPrice(pricing.subtotal) }} </span>
                    </div>
                    <div
                      v-if="CLASS_DISCOUNT > 0 && state.bookingPreference === 'myself'"
                      class="text-sm text-secondary-500 dark:text-secondary-400 font-normal flex justify-between"
                    >
                      <h2>Membership Discount ({{ CLASS_DISCOUNT }}%)</h2>
                      <p>- Rs. {{ formatPrice(pricing.discountAmount) }}</p>
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

                  <div class="border-b border-border/40 pb-6 mb-8" />
                </div>

                <div
                  class="flex flex-col sm:flex-row justify-between gap-4 mt-auto"
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
